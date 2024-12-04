const axios = require('axios');

const query = `
query searchStoreQuery(
  $allowCountries: String,
  $category: String,
  $count: Int,
  $country: String!,
  $keywords: String,
  $locale: String,
  $namespace: String,
  $itemNs: String,
  $sortBy: String,
  $sortDir: String,
  $start: Int,
  $tag: String,
  $releaseDate: String,
  $withPrice: Boolean = false
) {
  Catalog {
    searchStore(
      allowCountries: $allowCountries,
      category: $category,
      count: $count,
      country: $country,
      keywords: $keywords,
      locale: $locale,
      namespace: $namespace,
      itemNs: $itemNs,
      sortBy: $sortBy,
      sortDir: $sortDir,
      releaseDate: $releaseDate,
      start: $start,
      tag: $tag
    ) {
      elements {
        title
        namespace
        description
        releaseDate
        currentPrice
        keyImages {
          type
          url
        }
        seller {
          name
        }
        tags {
          name
        }
        customAttributes {
          key
          value
        }
        catalogNs {
          mappings(pageType: "productHome") {
            pageSlug
            pageType
          }
        }
        offerMappings {
          pageSlug
          pageType
        }
        categories {
          path
        }
        price(country: $country) @include(if: $withPrice) {
          totalPrice {
            discountPrice
            originalPrice
            discount
            currencyCode
          }
        }
      }
      paging {
        count
        total
      }
    }
  }
}
`;

const variables = {
  "country": "RU",
  "locale": "ru-RU",
  count: 100,
  withPrice: true,
};

(async function fetchAllGames() {
  let gamesData = [];
  const os_types = ["Windows", "Mac OS", "IOS", "Android"];
  let start = 0;
  let total = 0;
  let index = 0;

  do {
    variables.start = start;

    try {
      const response = await axios.post('https://graphql.epicgames.com/graphql', { query, variables});

      if (response.data && response.data.data && response.data.data.Catalog && response.data.data.Catalog.searchStore) {
        const searchStore = response.data.data.Catalog.searchStore;
        for (let data_chunk of searchStore.elements)
        {
          let title = data_chunk.title;

          let description = "-";
          if (title !== data_chunk.description) description = data_chunk.description;

          let publisher = data_chunk.seller.name;

          let tags = await getTags(data_chunk) || "-";

          let logoImg = await getLogoImage(data_chunk) || "-";

          let originalPrice = data_chunk.price.totalPrice.originalPrice;
          let discountPrice = data_chunk.price.totalPrice.discountPrice;
          let discountPercentage = 0;
          if (originalPrice - discountPrice !== 0) discountPercentage = (originalPrice - discountPrice) / originalPrice * 100; 

          let supported_os_list = [];
          for (let tag of data_chunk.tags) {
            if (os_types.includes(tag.name)) supported_os_list.push(tag.name);
          }
          let supported_os = supported_os_list.join(", ");

          let offerMappings = await getOfferSlug(data_chunk) || "";
          let catalogMappings = await getCatalogSlug(data_chunk) || "";
          let pageSlug = "-";
          if (offerMappings !== "") pageSlug = offerMappings; 
          else if (offerMappings === "" && catalogMappings !== "") pageSlug = catalogMappings;
          let url = "-";
          if (pageSlug !== "-") url = `https://store.epicgames.com/en-US/p/${pageSlug}`;

          gamesData.push({
            "title": title,
            "content_type": "",
            "description": description,
            "status": "",
            "release_date": "",
            "platform": "Epic Games",
            "tags": tags,
            "developer": "",
            "publisher": publisher,
            "min_system_requirements": "",
            "recommended_system_requirements": "",
            "supported_os": supported_os,
            "supported_languages": "",
            "url": url,
            "logo_image": logoImg,
            "price": discountPrice,
            "discount_%": discountPercentage,
          });
          console.log(gamesData[index]);
          index++;
        }
        total = searchStore.paging.total;
        start += searchStore.paging.count;
      } else {
        console.error('Unexpected response structure:', response.data);
        break;
      }
    } catch (error) {
      console.error('Error:', error);
      break;
    }
  } while (start < total);

  console.log(gamesData);
  return gamesData;
})();

async function getOfferSlug(data_chunk)
{
  try {
    let offerMappings = data_chunk.offerMappings.pageSlug;
    return offerMappings;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function getCatalogSlug(data_chunk)
{
  try {
    let catalogMappings = data_chunk.catalogNs.mappings.pageSlug;
    return catalogMappings;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function getLogoImage(data_chunk)
{
  try {
    let keyImages = data_chunk.keyImages;
    let logoImg = "";
    for (let keyImage of data_chunk.keyImages) {
      if (keyImage.type === "Thumbnail") logoImg = keyImage.url;
    }
    return logoImg;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function getTags(data_chunk)
{
  try {
    let tagsList = [];
    for (let tag of data_chunk.tags) {
      tagsList.push(tag.name);
    }
    let tags = tagsList.join(",");
    return tags;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}