const axios = require("axios");


const query = `
query collectionLayoutQuery(
  $locale: String = "ru-RU", 
  $country: String!, 
  $slug: String
) {
  Storefront {
    collectionLayout(locale: $locale, slug: $slug) {
      collectionOffers {
        title
        price(country: $country) {
          totalPrice {
            originalPrice
          }
        }
      }
    }
  }
}`;

const variables = {
  country: "RU", 
  locale: "ru-RU",
  slug: "most-popular",
};

module.exports = async function fetchTopGames() {
    try {
      const topGames = [];
      const response = await axios.post('https://graphql.epicgames.com/graphql', { query, variables });
      const data = response.data.data.Storefront.collectionLayout.collectionOffers;
      data.forEach((element, index) => {
        const title = element.title;
        topGames.push({
          "position": index+1, 
          "title": title,
        });
      });
      return topGames;
    } catch (error) {
      console.error("Error!", error);
    }
};
