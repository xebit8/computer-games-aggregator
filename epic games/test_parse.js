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
  country: "RU",
  locale: "ru-RU",
  count: 100,
  withPrice: true,
};

(async function egs_post()
{
  try {
    const response = await axios.post('https://graphql.epicgames.com/graphql', { query, variables});
      const data = response.data.data.Catalog.searchStore.elements;
      console.log(data);
      // for (let data_chunk of data)
      // {
      //   console.log(data_chunk);
      //   console.log(data_chunk);
      // }
      // console.log(`Found ${data.length} elements.`);
    } catch (error) {
      console.error(error);
  }
})();