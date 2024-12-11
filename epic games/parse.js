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
        id
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
            mappings {
              offerId
            }
            pageSlug
            pageType
            productId
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
  count: 1000,
  withPrice: true,
};

//module.exports = 
async function fetchAllGames() {
  let gamesData = [];
  const os_types = ["Windows", "Mac OS", "IOS", "Android"];
  let start = 0;
  let total = 0;
  let counter = 0;

  do {
    variables.start = start;

    try {
      const response = await axios.post('https://graphql.epicgames.com/graphql', { query, variables });

      if (response.data && response.data.data && response.data.data.Catalog && response.data.data.Catalog.searchStore) {
        const searchStore = response.data.data.Catalog.searchStore;
        for (let data_chunk of searchStore.elements) {
          let title = data_chunk.title;

          let description = "-";
          if (title !== data_chunk.description) description = data_chunk.description;

          let publisher = data_chunk.seller.name;

          let tags = await getTags(data_chunk) || "-";

          let logoImg = await getLogoImage(data_chunk) || "-";

          let originalPrice = data_chunk.price?.totalPrice?.originalPrice || 0;
          let discountPrice = data_chunk.price?.totalPrice?.discountPrice || 0;
          let discountPercentage = 0;
          if (originalPrice - discountPrice !== 0) discountPercentage = (originalPrice - discountPrice) / originalPrice * 100;

          let supported_os_list = [];
          for (let tag of data_chunk.tags) {
            if (os_types.includes(tag.name)) supported_os_list.push(tag.name);
          }
          let supported_os = supported_os_list.join(", ");

          let offerMappings = getOfferData(data_chunk);
          let catalogMappings = getCatalogData(data_chunk);
          let pageSlug = "-";
          if (offerMappings.pageSlug != null) pageSlug = offerMappings.pageSlug;
          else if (catalogMappings.pageSlug != null) pageSlug = catalogMappings.pageSlug;
          let offerId = "-";
          if (offerMappings.offerId != null) offerId = offerMappings.offerId;
          else if (catalogMappings.offerId != null) offerId = catalogMappings.offerId;
          let productId = "-";
          if (offerMappings.productId != null) productId = offerMappings.productId;
          else if (catalogMappings.productId != null) productId = catalogMappings.productId;
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
            "offerId": offerId,
            "productId": productId,
          });
          console.log(gamesData[counter]);
          counter++;
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

  console.log(`Found ${gamesData.length} elements.`);
  //console.log(gamesData);
  return gamesData;
}

function getOfferData(data_chunk) {
  let offer = { offerId: null, pageSlug: null, productId: null };
  // Проверка offerMappings
  if (data_chunk.offerMappings && data_chunk.offerMappings) {
    const mapping = data_chunk.offerMappings[0]; // Берем первый элемент
    if (mapping) {
      // Проверяем, что первый элемент существует
      if (mapping.mappings) {
        // Проверяем, что offerId не null
        offer.offerId = mapping.mappings.offerId;
      } else {
        offer.offerId = null;
      }
      offer.pageSlug = mapping.pageSlug;
      offer.productId = mapping.productId;
    } else {
      offer.offerId, offer.pageSlug, offer.productId = null, null, null;
    }
  } else {
    offer.offerId, offer.pageSlug, offer.productId = null, null, null;
  }
  return offer;
}

function getCatalogData(data_chunk) {
  let catalog = { offerId: null, pageSlug: null, productId: null };
  if (data_chunk.catalogNs && data_chunk.catalogNs.mappings) {
    const mapping = data_chunk.catalogNs.mappings[0];
    if (mapping) {
      if (mapping.mappings) {
        catalog.offerId = mapping.mappings.offerId;
      } else {
        catalog.offerId = null;
      }
      catalog.pageSlug = mapping.pageSlug;
      catalog.productId = mapping.productId;
    } else {
      catalog.offerId, catalog.pageSlug, catalog.productId = null, null, null;
    }
  } else {
    catalog.offerId, catalog.pageSlug, catalog.productId = null, null, null;
  }
  return catalog;
}

async function getLogoImage(data_chunk) {
  try {
    let logoImg = "";
    for (let keyImage of data_chunk.keyImages) {
      if (keyImage.type === "Thumbnail") logoImg = keyImage.url;
    }
    return logoImg;
  } catch (error) {
    console.error('Error in getLogoImage:', error);
    return null;
  }
}

async function getTags(data_chunk) {
  try {
    let tagsList = [];
    for (let tag of data_chunk.tags) {
      tagsList.push(tag.name);
    }
    let tags = tagsList.join(", ");
    return tags;
  } catch (error) {
    console.error('Error in getTags:', error);
    return null;
  }
}
fetchAllGames();