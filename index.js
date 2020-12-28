const faker = require('faker');
const fetch = require('node-fetch');
const cliProgress = require('cli-progress');
const _colors = require('colors');

const types = {
  clothes: [
    'casual',
    'sportswear',
    'women',
    'men',
    'children'
  ],
  accessories: [],
};

const companyNames = [
  'Megazord',
  'Platypus factories',
  'Aggressive otter',
  'Raw meat',
  'Capt\'n Hammer'
]

const images = {
  sportswear: [
    'https://assets.laboutiqueofficielle.com/w_450,q_auto,f_auto/media/products/2018/11/14/nasa_161854_NASA_SWCP_WORMLOGO_TRICOLBDX_20181114T164145_01.jpg',
    'https://www.google.com/url?sa=i&url=http%3A%2F%2Fblog.lenismodelmanagement.co.uk%2Ftag%2Fsportswear%2F&psig=AOvVaw31ZkgHBm-n79kY82qfD1za&ust=1608352838702000&source=images&cd=vfe&ved=2ahUKEwil56Gu29btAhW_AmMBHXHCBIgQjRx6BAgAEAc',
    'https://i.pinimg.com/236x/00/09/ed/0009ed1aa48c4e8add627f3aaf62587a--men-sportswear-mens-fitness-model.jpg',
    'https://i.pinimg.com/originals/d4/6e/80/d46e802441257d05f2e297483ec5df52.jpg',
  ],
  casual: [
    'https://cdn.cliqueinc.com/posts/244073/model-outfits-244073-1512582999453-image.700x0c.jpg',
    'https://i0.wp.com/www.mychicobsession.com/wp-content/uploads/2018/08/model-outfits.jpg?resize=1235%2C1852',
    'https://image.made-in-china.com/202f0j10AjYENyIPfqzo/The-Wholesale-Mens-Dress-Shirts-Models-with-Mens-Casual-Shirts-Men-Wash-and-Wear.jpg',
    'https://res.heraldm.com/content/image/2014/08/04/20140804000742_0.jpg',
  ],
  women: [
    'https://st2.depositphotos.com/3647147/10811/i/950/depositphotos_108112238-stock-photo-dress-woman-clothes-fashion-style.jpg',
    'https://media1.popsugar-assets.com/files/2015/02/05/558/n/2589278/ec128003_breewarren.xxxlarge.jpg',
    'https://i.pinimg.com/236x/6e/4b/25/6e4b2525373316f6cf16d8b612c5906a.jpg',
    'https://4.bp.blogspot.com/-A32qvFQx0r4/U3fC7yIe1NI/AAAAAAAACzY/Oe977xFSv3Q/s1600/women+clothing+models+%25282%2529.jpg',
    'https://ae01.alicdn.com/kf/HTB14qVIirZnBKNjSZFhq6A.oXXaK/Dresses-women-2020-Women-fall-models-European-plaid-dress-fake-two-packs-hip-pencil-free-belt.jpg'
  ],
  men: [
    'https://www.apetogentleman.com/wp-content/uploads/2018/06/male-models-tyson.jpg',
    'https://i.pinimg.com/originals/3d/11/de/3d11de7b7b69ea844efa24c2a39c0256.jpg',
    'https://photoartinc.com/wp-content/uploads/2018/02/mens-modeling-photos-12.jpg',
    'https://st2.depositphotos.com/1560768/5398/i/950/depositphotos_53988229-stock-photo-fashion-male-model-in-summer.jpg',
    'https://i.pinimg.com/originals/dc/44/a5/dc44a5e2e787a5e4c1f2354df2d9122e.jpg',
  ],
  children: [
    'https://i.pinimg.com/236x/fe/ff/8d/feff8d8869e7d06362bf67dbdd758bd8--caramel-baby-kids-wardrobe.jpg',
    'https://i.pinimg.com/236x/4f/87/cb/4f87cb1b445115c651f314e8838ee1d7--baby-girl-fashion-fashion-kids.jpg',
    'https://imgmedia.lbb.in/media/2020/10/5f9bc0a57372a75dc5da61fb_1604042917760.jpg',
    'https://i.pinimg.com/originals/c8/de/f4/c8def4a2d6e6f197eede8cd0422d3a1a.jpg',
  ]
}

const GENERATE_NB = 1950;

// const ENDPOINT = 'https://strapi-jamstack-zmg6cwiuca-ew.a.run.app';
const ENDPOINT = 'http://localhost:1337'
const makeBarFormat = (message, color) => ({
  format: `${message}: ${_colors[color]('[{bar}]')}  ETA: {eta}s | {value}/{total} | {percentage}%`,
  clearOnComplete: true,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

const creationBar = new cliProgress.SingleBar(makeBarFormat('Generating Data', 'magenta'));
const sendBar = new cliProgress.SingleBar(makeBarFormat('Sending Data', 'green'))
const fetchBar = new cliProgress.SingleBar(makeBarFormat('Data created', 'cyan'))

creationBar.start(GENERATE_NB, 0);
sendBar.start(GENERATE_NB, 0);
fetchBar.start(GENERATE_NB, 0);

const getRandomElementFromArray = (array) => array[Math.floor(Math.random() * Math.floor(array.length - 1))];
const rand = (n) => Math.floor(Math.random() * Math.floor(n))
const type = ['clothes', 'accessories'][rand(2)];

const generateProduct = () => {
  const category = types[type][rand(types.clothes.length - 1)];
  const imgSrc = images[category][rand(images[category].length - 1)];
  return {
    id: faker.random.uuid(),
    name: faker.lorem.words(),
    price: faker.commerce.price() / 10,
    description: faker.lorem.paragraph(),
    ref: getRandomElementFromArray(companyNames),
    promotions: rand(2) ? Math.floor(Math.random() * Math.floor(15)) * 5 : 0,
    type,
    category,
    images: {
      thumbnail: imgSrc,
      small: imgSrc,
      medium: imgSrc,
      big: imgSrc,
      origin: imgSrc,
    }
  };
};

const generateProducts = (nb) => Array.from(Array(nb), () => {
  creationBar.increment();
  return generateProduct();
});

const createdPromises = generateProducts(GENERATE_NB)
  .map(product => {
    // console.log(product)
    sendBar.increment();
    return fetch(`${ENDPOINT}/products`, { method: 'POST', body: JSON.stringify(product) })
      .then((data) => {
        fetchBar.increment();
        return data;
      })
      .catch((err) => console.log(err));
  });

Promise.all(createdPromises).finally(() => {
  creationBar.stop();
  sendBar.stop();
  fetchBar.stop();
})


// fetch('http://localhost:1337/products')
//     .then(res => res.json())
//     .then(e => e.forEach(({ id }) => { return fetch(`http://localhost:1337/products/${id}`, { method: 'DELETE' }) }))

