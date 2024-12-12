const axios = require('axios');

const query = `
query searchStoreQuery($allowCountries: String, $category: String, $count: Int, $country: String!, $keywords: String, $locale: String, $namespace: String, $itemNs: String, $sortBy: String, $sortDir: String, $start: Int, $tag: String, $releaseDate: String, $withPrice: Boolean = false, $withPromotions: Boolean = false, $priceRange: String, $freeGame: Boolean, $onSale: Boolean, $effectiveDate: String) {
  Catalog {
    searchStore(
      allowCountries: $allowCountries
      category: $category
      count: $count
      country: $country
      keywords: $keywords
      locale: $locale
      namespace: $namespace
      itemNs: $itemNs
      sortBy: $sortBy
      sortDir: $sortDir
      releaseDate: $releaseDate
      start: $start
      tag: $tag
      priceRange: $priceRange
      freeGame: $freeGame
      onSale: $onSale
      effectiveDate: $effectiveDate
    ) {
      elements {
        title
        id
        namespace
        description
        effectiveDate
        keyImages {
          type
          url
        }
        currentPrice
        seller {
          id
          name
        }
        productSlug
        urlSlug
        url
        tags {
          id
        }
        items {
          id
          namespace
        }
        customAttributes {
          key
          value
        }
        categories {
          path
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
          mappings {
            offerId
          }
          pageSlug
          pageType
          productId
        }
        price(country: $country) @include(if: $withPrice) {
          totalPrice {
            discountPrice
            originalPrice
            voucherDiscount
            discount
            currencyCode
            currencyInfo {
              decimals
            }
            fmtPrice(locale: $locale) {
              originalPrice
              discountPrice
              intermediatePrice
            }
          }
          lineOffers {
            appliedRules {
              id
              endDate
              discountSetting {
                discountType
              }
            }
          }
        }
        promotions(category: $category) @include(if: $withPromotions) {
          promotionalOffers {
            promotionalOffers {
              startDate
              endDate
              discountSetting {
                discountType
                discountPercentage
              }
            }
          }
          upcomingPromotionalOffers {
            promotionalOffers {
              startDate
              endDate
              discountSetting {
                discountType
                discountPercentage
              }
            }
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
  country: "RU",
  locale: "ru-RU",
  count: 100,
  withPrice: true,
};

(async function egs_post() {
  try {
    const response = await axios.post('https://graphql.epicgames.com/graphql', { query, variables });
    const data = response.data.data.Catalog.searchStore.elements;

    // Статистика
    let catalogNsMappingsNullCount = 0;
    let catalogNsMappingsRealCount = 0;
    let offerMappingsNullCount = 0;
    let offerMappingsRealCount = 0;

    for (let data_chunk of data) {
      console.log("<------------catalogNs------------>");
      // Проверка catalogNs.mappings
      if (data_chunk.catalogNs && data_chunk.catalogNs.mappings) {
        const mapping = data_chunk.catalogNs.mappings[0]; // Берем первый элемент
        if (mapping) {
          // Проверяем, что первый элемент существует
          if (mapping.mappings) {
            // Проверяем, что offerId не null
            console.log("offerId:", mapping.mappings.offerId);
            catalogNsMappingsRealCount++;
          } else {
            console.log("offerId: null");
            catalogNsMappingsNullCount++;
          }
          console.log("pageSlug:", mapping.pageSlug);
          console.log("pageType:", mapping.pageType);
          console.log("productId:", mapping.productId);
        } else {
          console.log("mappings: пустой список");
          catalogNsMappingsNullCount++;
        }
      } else {
        console.log("mappings: null");
        catalogNsMappingsNullCount++;
      }

      console.log("<------------offerMappings------------>");
      // Проверка offerMappings
      if (data_chunk.offerMappings && data_chunk.offerMappings) {
        const mapping = data_chunk.offerMappings[0]; // Берем первый элемент
        if (mapping) {
          // Проверяем, что первый элемент существует
          if (mapping.mappings) {
            // Проверяем, что offerId не null
            console.log("offerId:", mapping.mappings.offerId);
            offerMappingsRealCount++;
          } else {
            console.log("offerId: null");
            offerMappingsNullCount++;
          }
          console.log("pageSlug:", mapping.pageSlug);
          console.log("pageType:", mapping.pageType);
          console.log("productId:", mapping.productId);
        } else {
          console.log("mappings: пустой список");
          offerMappingsNullCount++;
        }
      } else {
        console.log("offerMappings: null");
        offerMappingsNullCount++;
      }

      console.log();
    }

    // Вывод статистики
    console.log("<------------ Статистика ------------>");
    console.log("catalogNs.mappings: null =", catalogNsMappingsNullCount, ", реальные значения =", catalogNsMappingsRealCount);
    console.log("offerMappings: null =", offerMappingsNullCount, ", реальные значения =", offerMappingsRealCount);
  } catch (error) {
    console.error(error);
  }
})();

