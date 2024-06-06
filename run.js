const bluebird = require("bluebird");
const fs = require("fs");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const puppeteer = require("puppeteer-extra");
const useProxy = require("@stableproxy/puppeteer-page-proxy");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const IDRIVE_ENPOINT = "d4b6.or4.idrivee2-60.com";
const IDRIVE_ACCESS_KEY_ID = "5ce3lLJdmdBVLqcX7RPD";
const IDRIVE_SECRET_ACCESS_KEY = "a6USwSGtrxBDlV2n19XUJWcMt69ivtpu5zm63Hfi";
const BUCKET_NAME = "alchemy-dwi-cookies";

const CONCURENCY = 2;
const HEADLESS = false; // HEADLESS  false or false;

const USE_PROXY = false;
const PROTOCOL = "http";
const PROXY_HOST = "gate.smartproxy.com";
const PROXY_PORT = "7000";
const PROXY_USERNAME = "spoj3coqzt";
const PROXY_PASSWORD = "ttZaB35y17tG~Ocsdw";

const dataAccount = `
eura.leuschke@fexbox.org,@@Masuk123$$,0x076a01e47112446c32c9be283da98057120f1e97
lucille.hartmann@fexbox.org,@@Masuk123$$,0x6e0018958beccf67d2ba100f5b4e7186d50aaa4e
alberta.labadie@fexbox.org,@@Masuk123$$,0x6d67f8d783c92f7e352bcf3e130f01ca73f54f40
kacie.hirthe@merepost.com,@@Masuk123$$,0x80da8247593585877d05f61a3fb8d04ef2ea6186
lee.turner@merepost.com,@@Masuk123$$,0xe6198b500b32623c4335b520c2897ffe85f213c3
ilana.feil@fexbox.org,@@Masuk123$$,0x5b0a260f55943cfb512d76b3b70a2d910cf3401a
edmond.nicolas@rover.info,@@Masuk123$$,0x4eb20d2839929b58cfa10e215b162f795c13dbef
coralie.kutch@merepost.com,@@Masuk123$$,0x68833267bc56f2d7b65e8a6feb3ec4e374c18601
joe.lakin@rover.info,@@Masuk123$$,0xc742e8c2fbd49a0c975bf1798752a9b53dcced06
allan.rutherford@merepost.com,@@Masuk123$$,0xe63c476de8b9400921850d62567850e31f703c98
ula.hansen@rover.info,@@Masuk123$$,0x6f20f8d4679fd3d691ff14c5e34a8ee66d2cf535
benjamin.volkman@merepost.com,@@Masuk123$$,0x3b0d6fb0d6c963525944f4969fea22d98637357c
felipe.mcglynn@fexbox.org,@@Masuk123$$,0x30a3cc10f534ec98d4168217b680d359141f2754
adrian.cartwright@mailto.plus,@@Masuk123$$,0x146e3149eef03157b346e789cee85ea35fdccf6a
samira.cummings@merepost.com,@@Masuk123$$,0x80f9fe41d127a5c2f1afc563821336cbe4132465
lacey.wiza@merepost.com,@@Masuk123$$,0x627472479f8024de78a726db90d05bdd6a5c2db8
elvira.king@rover.info,@@Masuk123$$,0xfb517bf42af27d360ee1e15007e72798bb52643b
tashia.russel@merepost.com,@@Masuk123$$,0xd234da4c2fc10345ae3ecf911d7f01e0c8c4fda3
jackie.mclaughlin@mailto.plus,@@Masuk123$$,0x2ea520103b7b995cf9723f77736df9446cd655ae
mitchell.wilkinson@mailto.plus,@@Masuk123$$,0x18b1fb6502cc5f41015da744e0538c8028389e50
carin.abshire@fexbox.org,@@Masuk123$$,0x39c43b77c55f4067cace4cc8ab12440f900b27b7
joshua.lind@rover.info,@@Masuk123$$,0x9ef78e0e18f777576d4b4e37109cbe99f2e5949e
nathaniel.schulist@mailto.plus,@@Masuk123$$,0xbef0836788e093a972b339d0a6b9e7b875e343d7
dexter.leuschke@fexbox.org,@@Masuk123$$,0xa96bed27eddf3c2dd3dc06bf78b6e799235f0ba5
matt.wisoky@rover.info,@@Masuk123$$,0xe1238be67fdb897a977fe12a817834a06e439c84
carrol.luettgen@rover.info,@@Masuk123$$,0x52beb84d24e3221fe7f1fcfb5a9d467e47cc4c58
jess.jones@rover.info,@@Masuk123$$,0xa78f01fa5ed09328be48d23b7771c9c559e6eef1
lauren.predovic@merepost.com,@@Masuk123$$,0xa789bf72d319dd1067acd5876d91e69277b3632a
otto.dach@fexbox.org,@@Masuk123$$,0x53b12505a0ae6eb6ac7207ebd484f4a7b9126e20
kennith.collins@mailto.plus,@@Masuk123$$,0xee804e3672d99a1e1af853857623f9a44d2c69ae
florentino.kling@merepost.com,@@Masuk123$$,0x0d45bfa5fbe34dbcd1d5f286d26c0ef9714063ca
rosalba.shanahan@mailto.plus,@@Masuk123$$,0x7bc53ccfc22fd97cd6a8c8c5c4ec0a5f2907ee63
melynda.bernier@merepost.com,@@Masuk123$$,0x3aa445ca698dc9f15703cf52cf02eb8113c03d82
mertie.boyle@merepost.com,@@Masuk123$$,0xe337f05f29167905b8799c972d62f2654cd80167
roni.ankunding@fexbox.org,@@Masuk123$$,0xd5ee1a22275841e0f9ec56f75493efa94e4b2913
ruthie.kulas@merepost.com,@@Masuk123$$,0xa156324d197e658af82e39f4fc330f91bf52d602
dallas.parker@fexbox.org,@@Masuk123$$,0x1f15af2e26ea5eafae88b5a31202c09e67766432
leonel.johns@mailto.plus,@@Masuk123$$,0xde9611185a12959977609af566d888e2c3d69545
shaun.ebert@merepost.com,@@Masuk123$$,0xc4006db4c97dc01101d8ce8128da24edcb78509f
audrea.o'conner@fexbox.org,@@Masuk123$$,0x8b024a7b52e350787ea29e2c44623f40f790f67a
gerri.herzog@mailto.plus,@@Masuk123$$,0x47832cce1aadad62a1c07384310e38b18e687ad4
thu.lubowitz@mailto.plus,@@Masuk123$$,0x6d4e73ff2cabad7d323b10e24370c1d854786060
obdulia.huels@fexbox.org,@@Masuk123$$,0xd8bb56f2b35882b5f8f75c7a038b3d85177016da
jerald.marks@merepost.com,@@Masuk123$$,0xa34651c1619b383e176cfa1aef4aeb2a5dd7d11d
silva.wisoky@merepost.com,@@Masuk123$$,0xb15c2e1e3f4201890772be25d39e87c8abd9e524
cecelia.morissette@fexbox.org,@@Masuk123$$,0x9f4a28c47a104f654af97d6ede9dc57a3a46ff7e
elvis.upton@rover.info,@@Masuk123$$,0x6e4d6b9928b9922b77307609f0bd1e3fa97fb171
collin.raynor@merepost.com,@@Masuk123$$,0x18899bd10d3ce203fdf69c0926709dca7f5b877d
tobias.heathcote@rover.info,@@Masuk123$$,0x8eb40360f5c5dd7931ad0eb6949408dc0bc545fe
gale.volkman@mailto.plus,@@Masuk123$$,0x438a31f8b7989d6ea74534e558d4dfec7a58c1ed
graham.sauer@rover.info,@@Masuk123$$,0x43f7162c8c3ee9c9206a5c21ecf9fc9a09df435e
wm.kuhlman@rover.info,@@Masuk123$$,0x4261188d10ceaae5697e9bea027e807740e0b560
leonardo.abernathy@rover.info,@@Masuk123$$,0x38040fb39efaf5d9893fc4f9f5248d557bf2ce42
ike.pagac@rover.info,@@Masuk123$$,0xd9c29330b718623f6e1073c2066858ebcbbf9a7b
hallie.schmidt@rover.info,@@Masuk123$$,0x19e4102c2a491636d894a2f02ef5c549936abb3c
melva.walker@rover.info,@@Masuk123$$,0x2ec244ac25cfe317b65a3febc94989ee92d61d4d
jeremiah.franecki@merepost.com,@@Masuk123$$,0x9094edb2cc96a41d4ce0de8e18a8cdd5c410af75
noelia.krajcik@rover.info,@@Masuk123$$,0x93dad2c13e5fb08a36c34a10939fa387791b630d
lori.heathcote@merepost.com,@@Masuk123$$,0x02bdb692b4e3456ac529c9f0441265a2a87cd62c
alise.balistreri@rover.info,@@Masuk123$$,0x5f20158341c613bcbc6c6ac975346a386333010f
holly.kuhic@mailto.plus,@@Masuk123$$,0x37bc29c380484bd3c19d276376b32d2facde4628
johnna.abernathy@mailto.plus,@@Masuk123$$,0x3b3cfc58e724c2ea0f89cd3f6b9d7457bf842836
fredrick.collier@mailto.plus,@@Masuk123$$,0xc29f69c354838b17b5ef5cd9e14bc7bcc08af145
annmarie.wiegand@merepost.com,@@Masuk123$$,0xcee0de19c06bc9ab2e35d451d3987496533a71e5
theodore.considine@fexbox.org,@@Masuk123$$,0x962c7359d49c267b592207be752112c7890fcb29
alex.mayert@fexbox.org,@@Masuk123$$,0x760020418dea004af465b644b777df4c245a9a4e
reena.renner@rover.info,@@Masuk123$$,0x5b6596b14c439d5098976e19a17894af429fecd0
prince.herzog@rover.info,@@Masuk123$$,0x18cfeb9ff4a1e4023aa27898d87229b180297a82
lynn.kirlin@mailto.plus,@@Masuk123$$,0xbe72fe006b1b8fb2b97e0cad453aa5172c9f50df
angelia.dickinson@fexbox.org,@@Masuk123$$,0x3cc170eab7ba23beb2244d7c1a83368d36eda599
jacquiline.heathcote@fexbox.org,@@Masuk123$$,0x664c637dcf0ce3ec334a8b6ff4dffbc8fa0739a9
dino.sanford@rover.info,@@Masuk123$$,0x28a8b957c7f49a82dc32582db475aa4646bd9617
lindsay.cassin@mailto.plus,@@Masuk123$$,0xbfe4d97a562d10204c81cdd02841ecbb71b91efc
alda.o'connell@merepost.com,@@Masuk123$$,0xbb2848aafc491a216834e0f6f55d0366e4972a06
denisse.kuhn@fexbox.org,@@Masuk123$$,0x38770aa988f4d5f28f5896f4737491a4200ee6c8
samella.haley@merepost.com,@@Masuk123$$,0x19775bb9a144a9956fc0e84d8b53d82253291172
kayla.blick@fexbox.org,@@Masuk123$$,0x2229b07a4ddbdb65d56eaf120c1addd1bf6372e9
rebecca.nader@merepost.com,@@Masuk123$$,0x2b121277b5fa00849d7ccd88996111d40bc1d308
lonnie.torp@mailto.plus,@@Masuk123$$,0x19035067225642c8808ce0db5bdef53961f2ae8d
cody.mohr@merepost.com,@@Masuk123$$,0xa83dfffde5c2cd996106ea8fb170a6db25f6c596
kyong.hyatt@merepost.com,@@Masuk123$$,0x3fee68e4a129f0665be1f15404fab15ed6102afe
shaunna.casper@mailto.plus,@@Masuk123$$,0x7545ac754522bb346ee28a5ba0dd2f01fb1c17e7
dwight.bernier@fexbox.org,@@Masuk123$$,0x009fe222eee09f48f907fe4843062cb411215200
harley.watsica@mailto.plus,@@Masuk123$$,0x313123c88d778e715c6406958147c9091020a0a0
marleen.bartoletti@fexbox.org,@@Masuk123$$,0xe9debfbcba215de5addd6880c4df8fd930a97cb4
odell.ratke@merepost.com,@@Masuk123$$,0x2f70228bbdba60a20201390625303c84ce921b15
malcom.jast@rover.info,@@Masuk123$$,0x4fb81c008a146b3b74a47cff72609f58c8ebd1cc
taisha.gerhold@mailto.plus,@@Masuk123$$,0x7f1df95cee87e601e7c4c905b62d4013683108ae
derek.hansen@mailto.plus,@@Masuk123$$,0xe5ea4a3666121e9a7b65b89993ba5794b9580a96
ira.stracke@mailto.plus,@@Masuk123$$,0xe7fd17e3b162f69d9866bfbb87e3e43db8dafd81
kittie.bergstrom@fexbox.org,@@Masuk123$$,0xf9f7713c8fadc02ecb1ec1de9dfd7b1708d739fa
joaquin.predovic@merepost.com,@@Masuk123$$,0x6e2404e42c9af9cb1677264769bfbd783c6b43f7
sammy.lemke@mailto.plus,@@Masuk123$$,0x099ce941c90b7c0a398a0264a61867a7f12042a9
destiny.pagac@rover.info,@@Masuk123$$,0xbbc5fad9a197cdf2456f53003fa0d4a19cb19909
shala.dibbert@merepost.com,@@Masuk123$$,0xce63a86bae1ced80ca62e2f97ae286e94c994d49
freeman.osinski@mailto.plus,@@Masuk123$$,0xf0152ea5e631617cbd65753a913dc28ae7322615
lurline.dare@merepost.com,@@Masuk123$$,0x19e7ab81339131b64b0a5acc4fb0b263e5c40adf
melani.labadie@mailto.plus,@@Masuk123$$,0xe9b2261c69641189386b557f90e4762095b98a18
karan.brown@merepost.com,@@Masuk123$$,0xffb42da4eafba5d72309f0dec9f8fe2bbeacc712
rosy.hamill@mailto.plus,@@Masuk123$$,0x6fbb39c5c245a64937ee43688818f1973c5855a5
isaias.ryan@rover.info,@@Masuk123$$,0xe9200bfbc9ba93c08784591ed28fa8c389d94faf
cedric.miller@mailto.plus,@@Masuk123$$,0x715c856d6d641e96fe54025f1ae3c7f86b794f7e
jacklyn.greenfelder@merepost.com,@@Masuk123$$,0x1fe75f9f5ef6906845bf116f25b1bbe5d6f47c79
sean.cormier@fexbox.org,@@Masuk123$$,0x444e3252f0af8360c3ca9b15de5ca71eba59be37
neta.durgan@mailto.plus,@@Masuk123$$,0x9778f7a68229318268d6b5fc1f1ebbd63a921f44
kevin.carter@merepost.com,@@Masuk123$$,0x81abc9d52f2b8d557cc1acea3200652e00f54e1a
antione.rogahn@mailto.plus,@@Masuk123$$,0x241c7421fefa5b27e355623037d66c4dd18332d0
rogelio.grady@fexbox.org,@@Masuk123$$,0xa0ffd1decb49479a8e2d90919df5d31c1b56b07c
johnna.treutel@fexbox.org,@@Masuk123$$,0xae9af83f83348de0a4b7299a0a304f9b12b5184b
jenee.lubowitz@mailto.plus,@@Masuk123$$,0x570efd94e31c238a6a5c1d066aebecfbff40b7c4
alfredo.hermann@mailto.plus,@@Masuk123$$,0x2530cdcbe922e9c3adbc6f5182f51abee8aa7ea3
ollie.keeling@mailto.plus,@@Masuk123$$,0xde146e9dfe0808adc461637a62b14d127048604e
williams.mraz@rover.info,@@Masuk123$$,0x798fc46a560b801ddadb0e9eb9a656e586a0a0ee
eleanore.legros@rover.info,@@Masuk123$$,0x376b936793ee271a06109079b9160ecc4baa7134
marchelle.bode@fexbox.org,@@Masuk123$$,0xc1e520af32f7c93f86788f10f0a558685c02318c
sharen.cartwright@fexbox.org,@@Masuk123$$,0x6a37c8943674cd427a21297693f723da15332120
verna.emard@fexbox.org,@@Masuk123$$,0x2ee1a40cb58b2cc50b290be9882e4b7e07d846b7
janessa.gutkowski@fexbox.org,@@Masuk123$$,0x7b091fa799982d033db8c6cedbfd5c6ec1522269
rhonda.baumbach@merepost.com,@@Masuk123$$,0x383fba9c5fba0d056daa939c3fbf3ee27375136b
alyse.schmeler@merepost.com,@@Masuk123$$,0x29ea15976d47cded0a20aff7a6d7d4d978af36a0
emery.sanford@fexbox.org,@@Masuk123$$,0x8fa08d3366bb07eb4489c16c611b41bb1bb9e95d
donnie.aufderhar@merepost.com,@@Masuk123$$,0x59979922f9816d81a2d2982f0a03b51cfd062d8f
ali.mcclure@fexbox.org,@@Masuk123$$,0xe77167882b7c78ed81c5c797dc234afa836a3ad4
rob.mertz@merepost.com,@@Masuk123$$,0x2dbe0848af01b69c77799e2a4df24106cd004acb
waneta.rosenbaum@rover.info,@@Masuk123$$,0x3c179150b0f0beba491bcf1b7a860ad5283c9cc9
andy.kuhlman@fexbox.org,@@Masuk123$$,0x98c9dd91647f3dbb110ad452a9c7ef5f43eb6a24
frances.stroman@rover.info,@@Masuk123$$,0xc45f6d7be564f0b0e71257683d1dddc70ea8c085
florentino.toy@fexbox.org,@@Masuk123$$,0x19a61f902fcf9fbf18df406df1973874567db51d
will.wunsch@rover.info,@@Masuk123$$,0x0bc837bee6714c0ef7213586164802ef3c342d66
stephan.effertz@mailto.plus,@@Masuk123$$,0x79b25eb36a72cc01a6cf64a3d2eb594d0624ad2d
emery.schmitt@mailto.plus,@@Masuk123$$,0xa1ffd7b2970f2d15ac288364619d90e4a697d5c3
liz.boyer@merepost.com,@@Masuk123$$,0x26380e3cc33cde7b51d0fc87dd8b35506bebf03d
donny.macejkovic@fexbox.org,@@Masuk123$$,0x96551fe7685bf65d01f2199676d59f27ba346838
millard.cummings@mailto.plus,@@Masuk123$$,0x8596f977fc197fa0485d9386905c60b47074a009
gwen.dibbert@fexbox.org,@@Masuk123$$,0x91ba0fac7dc084702196070e758a76c648e87a02
mohammad.dare@merepost.com,@@Masuk123$$,0xee4e86a67bf8043905173dc56249790e721ad0bf
tillie.hammes@merepost.com,@@Masuk123$$,0x671331a44792b241c0d95e2678bdfe4ed432f209
krista.wuckert@merepost.com,@@Masuk123$$,0x1d259ebfe046d3bea1e2b8bf16a428e8833d48f5
rea.gorczany@rover.info,@@Masuk123$$,0x4fedb6a92a7ef24804e881605d8fd8c2fe4b9db9
veronique.o'connell@rover.info,@@Masuk123$$,0x73c42d02155242b347618301a89a2d8e31a64740
vito.kris@merepost.com,@@Masuk123$$,0xf9c90b222344b93e85b87ad173eeac0aa2253006
deedee.wiza@mailto.plus,@@Masuk123$$,0x3f4982f25cb079366709249d0bece71445d56893
coy.corwin@fexbox.org,@@Masuk123$$,0x5a35670bc11ff327ef41a17d6ccbf35838b1494b
brant.heidenreich@mailto.plus,@@Masuk123$$,0x06016171a44191e7cba578d5f1fc5a187dba26f5
olen.ritchie@mailto.plus,@@Masuk123$$,0xbb4eb121343ed9cf869b5a20b10c433db58ade49
arthur.o'connell@rover.info,@@Masuk123$$,0x83dc57499014664bbf3f1269917b8705685fef50
santina.breitenberg@mailto.plus,@@Masuk123$$,0x68482b136376891970b37c1c883d51208aec8b87
cedrick.stracke@mailto.plus,@@Masuk123$$,0xa0150419010c8ee68be38a0c09323c9d5bf937df
maud.sawayn@mailto.plus,@@Masuk123$$,0x3093605d68b72c84a17b1707d59f0712abac1199
ozzie.johnson@mailto.plus,@@Masuk123$$,0xc412aef8943cb4d7043a7afa047d0ebe8d8cd232
`;

const waiting = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const getData = (data, start, end) => {
  const splitData = data.split(/\r?\n/).filter((n) => n);
  const sliceData = splitData.slice(start, end);
  return sliceData;
};

const s3 = () => {
  const endpoint = new AWS.Endpoint(IDRIVE_ENPOINT);
  const s3 = new AWS.S3({
    endpoint: endpoint,
    accessKeyId: IDRIVE_ACCESS_KEY_ID,
    secretAccessKey: IDRIVE_SECRET_ACCESS_KEY,
  });

  return s3;
};

const existsBucket = async (bucketName) => {
  try {
    await listObjects(bucketName);

    return true;
  } catch (err) {
    if (err.code == "NoSuchBucket") {
      return false;
    } else {
      throw err;
    }
  }
};

const listObjects = (bucketName) => {
  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
    };

    s3().listObjects(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getObject = (bucketName, fileName) => {
  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
      Key: fileName,
    };

    s3().getObject(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const createObject = async (obj, bucketName, fileName) => {
  const buf = Buffer.from(JSON.stringify(obj));

  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
      Key: fileName,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "application/json",
      ACL: "private",
    };

    s3().upload(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const checkExistsObject = async (bucketName, fileName) => {
  try {
    await getObject(bucketName, fileName);

    return true;
  } catch (err) {
    if (err && (err.code == "NoSuchKey" || err.code == "NoSuchBucket"))
      return false;
  }
};

const saveCookies = async (page, cookieFile) => {
  const session = await page.target().createCDPSession();
  const reaponseCookies = await session.send("Network.getAllCookies");

  await session.detach();
  await createObject(reaponseCookies.cookies, BUCKET_NAME, cookieFile);
};

const loadCookies = async (page, cookieFile) => {
  const session = await page.target().createCDPSession();
  const cookies = JSON.parse(cookieFile);
  await session.send("Network.setCookies", {
    cookies: cookies,
  });
  await session.detach();
};

const retryElement = async (page, element, xpath = false, retryCount = 2) => {
  try {
    if (xpath) {
      return await page.waitForXPath(element, { timeout: 8000 });
    } else {
      return await page.waitForSelector(element, { timeout: 8000 });
    }
  } catch (err) {
    if (retryCount <= 0) {
      throw err;
    }
    const currentUrl = await page.url();
    await page.goto(currentUrl, { waitUntil: "networkidle2" });

    return await retryElement(page, element, (xpath = false), retryCount - 1);
  }
};

const launchBrowser = async () => {
  try {
    let browser;

    let args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-notifications",
      "--no-first-run",
      "--disable-gpu",
      // "--start-maximized",
      "--disable-infobars",
      "--disable-web-security",
      "--ignore-certificate-errors",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-features=IsolateOrigins,site-per-process,SitePerProcess",
      "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
    ];

    const proxyHost = `${PROTOCOL}://${PROXY_HOST}:${PROXY_PORT}`;

    USE_PROXY ? args.push(`--proxy-server=${proxyHost}`) : null;

    let browserOptions = {
      executablePath: process.env.PUPPETEER_EXEC_PATH,
      headless: HEADLESS,
      ignoreHTTPSErrors: true,
      acceptInsecureCerts: true,
      defaultViewport: null,
      args: args,
    };

    browser = await puppeteer.launch(browserOptions);
    const context = browser.defaultBrowserContext();

    context.overridePermissions("https://auth.alchemy.com", [
      "geolocation",
      "notifications",
    ]);
    context.overridePermissions("https://www.alchemy.com", [
      "geolocation",
      "notifications",
    ]);

    const [page] = await browser.pages();

    if (USE_PROXY) {
      await page.authenticate({
        username: PROXY_USERNAME,
        password: PROXY_PASSWORD,
      });
    }

    await page.setRequestInterception(true);
    const rejectRequestPattern = [
      "googlesyndication.com",
      "/*.doubleclick.net",
      "/*.amazon-adsystem.com",
      "/*.adnxs.com",
      "/*.ads.net",
    ];
    const blockList = [];
    page.on("request", (request) => {
      if (
        rejectRequestPattern.find((pattern) => request.url().match(pattern))
      ) {
        blockList.push(request.url());
        request.abort();
      } else request.continue();
    });

    return { page, browser };
  } catch (err) {
    console.log(`Browser ${err}`);
  }
};

const login = async (page, email, password) => {
  try {
    await page.goto("https://www.alchemy.com/faucets/arbitrum-sepolia", {
      waitUntil: "networkidle2",
    });

    const cookieFile = `${email}.json`;

    const isExistCookies = await checkExistsObject(BUCKET_NAME, cookieFile);

    if (isExistCookies) {
      const getCookies = await getObject(BUCKET_NAME, cookieFile);
      const cookies = getCookies.Body.toString("utf-8");
      await loadCookies(page, cookies);
    }

    await waiting(5000);

    const logoutButtonElm = await page.$$eval("button", (button) => {
      const logoutButton = button.find(
        (btn) => btn.textContent.trim() == "Logout"
      );

      if (logoutButton) {
        return true;
      }

      return false;
    });

    if (logoutButtonElm) {
      return true;
    }

    await page.$$eval("button", (button) => {
      const loginButton = button.find(
        (btn) => btn.textContent.trim() == "Alchemy Login"
      );

      if (loginButton) {
        loginButton.focus();
        loginButton.click();
      }
    });

    await waiting(10000);

    try {
      await retryElement(page, 'input[type="email"]');

      const inputUser = await page.$('input[type="email"]');
      await page.evaluate((user) => {
        user.focus();
        user.click();
      }, inputUser);
      await page.keyboard.type(email);

      const inputPass = await page.$('input[type="password"]');
      await page.evaluate((pass) => {
        pass.focus();
        pass.click();
      }, inputPass);
      await page.keyboard.type(password);

      await page.waitForSelector('button[type="submit"]');
      const buttonLogin = await page.$('button[type="submit"]');

      await page.evaluate((login) => {
        login.click();
      }, buttonLogin);

      await waiting(15000);

      await saveCookies(page, cookieFile);
    } catch (err) {}

    return true;
  } catch (err) {
    console.log(`[${email}] - Login error ${err}`);
  }
};
const claimFoucet = async (page, email, wallet) => {
  let success = false;
  let retry = 0;
  let maxTry = 3;
  let message = "";

  try {
    while (!success && retry <= maxTry) {
      await waiting(2000);

      await retryElement(page, 'form input[type="text"]');
      const walletInputElm = await page.$('form input[type="text"]');

      await page.evaluate((walletInput) => {
        walletInput.focus();
        walletInput.click();
      }, walletInputElm);

      await page.keyboard.down("Control");
      await page.keyboard.press("A");
      await page.keyboard.up("Control");
      await page.keyboard.press("Backspace");
      await page.keyboard.sendCharacter(wallet);

      await page.waitForXPath('//div/button[contains(., "Send Me ETH")]');

      const [sendButtonElm] = await page.$x(
        '//div/button[contains(., "Send Me ETH")]'
      );

      await waiting(2000);

      await sendButtonElm.click();

      await waiting(4000);

      const successClaimElm = await page.$x(
        '//*[@id="root"]/div[1]/div[2]/div[3]/div[2]/div/div[2]/div/div[2]'
      );

      if (successClaimElm !== "undefined" && successClaimElm.length > 0) {
        console.log(`[${email}] - BERHASIL CLAIM ARBIT !!`);
        success = true;
        return true;
      } else {
        const [spanMessageElm] = await page.$x('//div[@role="alert"]/span');

        let textMessage = await page.evaluate(
          (element) => element.textContent.trim(),
          spanMessageElm
        );

        message = textMessage;

        retry++;

        await waiting(3000);
      }
    }

    console.log(`[${email}] - GAGAL CLAIM ARBIT ${message}`);
    return true;
  } catch (err) {
    console.log(`[${email}] - TERJADI ERROR: ${err}`);
  }
};

const bot = async (page, account) => {
  let success = false;
  try {
    await page.bringToFront();
    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");
    await client.send("Page.enable");
    await client.send("Page.setWebLifecycleState", { state: "active" });

    const data = account.split(",");
    const email = data[0];
    const password = data[1];
    const wallet = data[2];

    const sigin = await login(page, email, password);

    if (sigin) {
      success = await claimFoucet(page, email, wallet);
    }

    return success;
  } catch (err) {
    console.log(err);
  }
};
(async () => {
  const args = process.argv;

  // const startData = parseInt(args[2]);
  // const endData = parseInt(args[3]);

  // if (!startData && !endData) {
  //   console.log(`Params require "node run.js 0 5"`);
  //   process.exit();
  // }

  // For github action
  const rangeDate = process.env.RANGE_INDEX;
  const splitDate = rangeDate.split(",");
  const startData = splitDate[0];
  const endData = splitDate[1];

  const accounts = getData(dataAccount, startData, endData);

  return bluebird.map(
    accounts,
    async (account) => {
      const { page, browser } = await launchBrowser();

      try {
        await bot(page, account);
      } catch (err) {
        await browser.close();
      }

      await browser.close();
    },
    { concurrency: CONCURENCY }
  );
})();
