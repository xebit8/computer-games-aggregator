const axios = require('axios');
const getAdditionalGameData = require("./parse_game_additional");


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
  count: 200,
  withPrice: true,
};

module.exports = async function fetchAllGames() {
  let gamesData = [];
  const os_types = ["Windows", "Mac OS", "IOS", "Android"];
  // let start = 0;
  // let total = 0;
  let counter = 0;

  do {
    // variables.start = start;
    try {
      const response = await axios.post('https://graphql.epicgames.com/graphql', { query, variables });

      if (response.data && response.data.data && response.data.data.Catalog && response.data.data.Catalog.searchStore) {
        const searchStore = response.data.data.Catalog.searchStore;
        for (let data_chunk of searchStore.elements) {

          console.log(counter+1);
          counter++;

          let offerMappings = getOfferData(data_chunk);
          let catalogMappings = getCatalogData(data_chunk);

          let offerId = "-";
          if (offerMappings.offerId != null) offerId = offerMappings.offerId;
          else if (catalogMappings.offerId != null) offerId = catalogMappings.offerId;

          let productId = "-";
          if (offerMappings.productId != null) productId = offerMappings.productId;
          else if (catalogMappings.productId != null) productId = catalogMappings.productId;

          // Skip all content without access to additional info
          if (productId === "-" || offerId === "-") continue;

          let additionalgamesData = await getAdditionalGameData(productId, offerId);
          // Skip all content without additional data
          // for (let key of Object.keys(additionalgamesData)) {
          //   if (additionalgamesData[key] == null) continue;
          // }

          let pageSlug = "-";
          if (offerMappings.pageSlug != null) pageSlug = offerMappings.pageSlug;
          else if (catalogMappings.pageSlug != null) pageSlug = catalogMappings.pageSlug;

          let title = data_chunk.title;

          // Skip all content without that doesn't match it's data
          if (title !== additionalgamesData.title) continue;

          let description = "-";
          if (title !== data_chunk.description) description = data_chunk.description;

          let publisher = data_chunk.seller.name;

          let logoImg = await getLogoImage(data_chunk) || "-";

          let originalPrice = data_chunk.price?.totalPrice?.originalPrice || 0;
          let discountPrice = data_chunk.price?.totalPrice?.discountPrice || 0;
          let discountPercentage = 0;
          if (originalPrice - discountPrice !== 0) discountPercentage = (originalPrice - discountPrice) / originalPrice * 100;
          
          let url = "-";
          if (pageSlug !== "-") url = `https://store.epicgames.com/ru/p/${pageSlug}`;

          gamesData.push({
            "title": title,
            "content_type": additionalgamesData.content_type,
            "description": description,
            "status": additionalgamesData.status,
            "release_date": additionalgamesData.release_date,
            "platform": "Epic Games",
            "genres": additionalgamesData.genres,
            "developer": additionalgamesData.developer,
            "publisher": publisher,
            "supported_os": additionalgamesData.supported_os,
            "url": url,
            "logo_image": logoImg,
            "price": discountPrice,
            "discount_%": discountPercentage,
            "productId": productId,
            "offerId": offerId,
          });
        }
        // total = searchStore.paging.total;
        // start += searchStore.paging.count;
      } else {
        console.error('Unexpected response structure:', response.data);
        break;
      }
    } catch (error) {
      console.error('Error:', error);
      break;
    }
  } while (counter < variables.count);

  console.log(`Found ${gamesData.length} elements.`);
  //console.log(gamesData);
  return gamesData;
};

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
//fetchAllGames();