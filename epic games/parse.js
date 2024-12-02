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
  $withPrice: Boolean = false,
  $withPromotions: Boolean = false
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
        id
        namespace
        description
        effectiveDate
        keyImages {
          type
          url
        }
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
  "country": "US",
  "locale": "en-US",
  count: 1000
};

(async function fetchAllGames() {
  let allGames = [];
  let start = 0;
  let total = 0;

  do {
    variables.start = start;

    try {
      const response = await axios.post('https://graphql.epicgames.com/graphql', {
        query,
        variables
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.data && response.data.data && response.data.data.Catalog && response.data.data.Catalog.searchStore) {
        const searchStore = response.data.data.Catalog.searchStore;
        allGames = allGames.concat(searchStore.elements);
        for (let data_chunk of searchStore.elements)
        {
                console.log(data_chunk.title);
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

  return allGames;
})();