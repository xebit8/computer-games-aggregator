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
        productSlug
        urlSlug
        url
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
  "country": "US",
  "locale": "en-US",
  count: 1000
};

(async function fetchAllGames() {
  let allGames = [];
  let start = 0;
  let total = 0;
  let mapping_counter = 0;
  let offerMappings_counter = 0;
  let counter = 0;
  let and_counter = 0;
  let or_counter = 0;

  do {
    variables.start = start;

    try {
      const response = await axios.post('https://graphql.epicgames.com/graphql', { query, variables});

      if (response.data && response.data.data && response.data.data.Catalog && response.data.data.Catalog.searchStore) {
        const searchStore = response.data.data.Catalog.searchStore;
        allGames = allGames.concat(searchStore.elements);
        for (let data_chunk of searchStore.elements)
        {
          let title = data_chunk.title;
          let mappings = data_chunk.catalogNs.mappings;
          let offerMappings = data_chunk.offerMappings;

          if (mappings === null || mappings.length === 0) mapping_counter++;
          if (offerMappings === null || offerMappings.length === 0) offerMappings_counter++;
          if ((mappings === null || mappings.length === 0) && (offerMappings === null || offerMappings.length === 0)) and_counter++;
          if ((mappings === null || mappings.length === 0) || (offerMappings === null || offerMappings.length === 0)) or_counter++;
          counter++;

          console.log(title);
          console.log(mappings);
          console.log(offerMappings);
          console.log("Empty urlSlugs --", "1:", mapping_counter, "2:", offerMappings_counter, "(1 & 2):", and_counter, "(1 | 2):", or_counter, "all:", counter);
          console.log();
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