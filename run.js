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
loren.braun@fexbox.org,@@Masuk123$$,0xde9a2f7e127a9c06438da82b742b0551abff0edd
katharine.dickens@fexbox.org,@@Masuk123$$,0xb19bee6487c33fa91cb3060cddddd0c121d4ddfe
janine.kohler@fexbox.org,@@Masuk123$$,0x7ce23c31f00193ccb91eca6c35f7ffb19c9ea909
tracie.friesen@merepost.com,@@Masuk123$$,0xf57f9062008c61a6a9b8b44a669d6a92f77f6092
marcelene.bergnaum@rover.info,@@Masuk123$$,0x29ab0c29bd01992336d05931ec00433a34f7a5ea
rachael.sipes@merepost.com,@@Masuk123$$,0x8885c7a0464b4f2140798788ef1604c147c6bf1b
rolf.hegmann@mailto.plus,@@Masuk123$$,0xf2d3fd5ace7d5a91a88a2c92c0f0036b3b82439e
hobert.bartoletti@mailto.plus,@@Masuk123$$,0x5f7a417058089e3907ac955ef8beccd03554f31d
cathie.tromp@rover.info,@@Masuk123$$,0xaab186defaa3020222c133577d00cfbf1ee03a4f
russ.kuhic@fexbox.org,@@Masuk123$$,0x5ee95893cca521b04a6748583f9559de3cf1fb9b
myrle.shields@rover.info,@@Masuk123$$,0xec000c86fb32aef8d9dc12d7f9eda9ec194273b1
dallas.adams@mailto.plus,@@Masuk123$$,0xb9e8244d43eb51e1285892c94582e7d85854f754
moises.kiehn@merepost.com,@@Masuk123$$,0xa91cde64e548f4c5ea3d10c6355979717f95722d
ching.rempel@fexbox.org,@@Masuk123$$,0xbef7ed7f4cee54acbe8910c63ff39e6d980380f0
michelina.champlin@fexbox.org,@@Masuk123$$,0x8eaec949d778a9e4c4c8716d689b7db804db30cf
lyle.jacobs@rover.info,@@Masuk123$$,0xf3e2d883297cb306dcf65ff08229940956e97ae2
eusebio.lesch@merepost.com,@@Masuk123$$,0x2930ad29b9549b1215fa8964b629b3a0fd81aefe
jordan.schmitt@mailto.plus,@@Masuk123$$,0x1b4217c43427a46a75094156962efd2cbd162e67
maria.sauer@merepost.com,@@Masuk123$$,0x5655dad28092ca81bbc3ae9fdd2a6c2356f02571
arletta.hayes@fexbox.org,@@Masuk123$$,0x0938a9200c75728b827405b23d7bf7e420dfb7da
maureen.reichel@mailto.plus,@@Masuk123$$,0x004a9dc5884a89684d5c957f17175eb980109d7c
mauricio.keebler@rover.info,@@Masuk123$$,0x8ae01f76f537f8e8709d06af7b3ae74ab67ca349
aaron.bogisich@fexbox.org,@@Masuk123$$,0xab4f4273cf9a4b1384e3a78c69a83cd1fe8abe06
wilmer.schmeler@rover.info,@@Masuk123$$,0x93bd7690c9b6f47c75727188552e6624542dc965
carli.buckridge@merepost.com,@@Masuk123$$,0xa75b11c9faf73c3b3b6fb9c7e9ca3f7bd360c778
marielle.marquardt@rover.info,@@Masuk123$$,0xbf01625a6fdbcb35802468b2348e027a0bd9053d
seth.donnelly@merepost.com,@@Masuk123$$,0x68fa2cf8eb1dc3ded20471657537d854df40c7cb
anton.orn@fexbox.org,@@Masuk123$$,0x214620b5921db3d3e2ce8a0a8ec67345cbec9ac8
jessenia.walker@rover.info,@@Masuk123$$,0xb718043d32be094f58278c589a28820ae135338d
erlinda.crona@fexbox.org,@@Masuk123$$,0x89e26fd6f59d7d7f8c01edcd9e7fe03cf193ae97
arron.roberts@fexbox.org,@@Masuk123$$,0x1c4ef5f40c22ca4c54cc0620192e6e4580b4e411
lucrecia.brown@mailto.plus,@@Masuk123$$,0x3a08582c57017f61a984e8bf033fe26de8dd52e2
lashanda.dickens@merepost.com,@@Masuk123$$,0x6e7df45359c0140bd018c4cbcf82f0291ef9bc61
randell.orn@mailto.plus,@@Masuk123$$,0x8fa3b3614ac818d8c311439460458fee0260c3e6
fritz.gerlach@mailto.plus,@@Masuk123$$,0x7f0f6066173943c49ac23f760a279f3d34625df4
asha.lemke@merepost.com,@@Masuk123$$,0x9a1317e5e7c3aadefb5129a68a3e69dbfc258fe3
jeff.koss@mailto.plus,@@Masuk123$$,0xf8f56ddf74cc0b6b965f8dba43b68e4b99f9409e
artie.aufderhar@merepost.com,@@Masuk123$$,0x24e10a324ee6f74becdd2efa1b89c71a8649b9c0
britteny.rau@mailto.plus,@@Masuk123$$,0xe99f8f90fe9fad1b40b1087bf4677686bc0ee09b
wm.mohr@fexbox.org,@@Masuk123$$,0x9b02797b8fab429a429a139547b2bddddbc2bf24
chantelle.reichert@rover.info,@@Masuk123$$,0x1b16a8e15a2080d13744823f95f360bb543d7209
samuel.tremblay@merepost.com,@@Masuk123$$,0x266a8fb73dcf96558512ba30801f5220d2b0ec5d
milton.abshire@fexbox.org,@@Masuk123$$,0x7094e621393852390ba43d2f4d202cfaf296453e
elly.legros@merepost.com,@@Masuk123$$,0x651fc9968e7cff6db247785714d16fef3f45d669
iliana.dare@rover.info,@@Masuk123$$,0x260851115723d68f68f8466d20c214ff031d1180
willia.cassin@mailto.plus,@@Masuk123$$,0x43922d17c90bd71a710a8699205a9790b1e308eb
maire.connelly@rover.info,@@Masuk123$$,0x1f80e7a1bc3dddf8577bc06765083a6b8beeff63
jorge.bruen@merepost.com,@@Masuk123$$,0x0dc695282ebbbc2bbeaabd69e6873b0a0a256fba
terry.wiza@mailto.plus,@@Masuk123$$,0x84ef0bd55e5edd90a4eda357d317c767f8255f0e
jewel.boyle@rover.info,@@Masuk123$$,0x1390fc6a9767654f3e6f6f273324a6b4dabceaac
nelly.sporer@merepost.com,@@Masuk123$$,0xac4393270299f1f9a921191d4ddd3e9ad2db147f
nidia.kling@merepost.com,@@Masuk123$$,0xba64c52621cf41e0aeff3ae5a88d4922b1038c5e
maira.johns@fexbox.org,@@Masuk123$$,0xd54dd70499bb7313bf5c1c8f6afc02bc156730a3
kymberly.hilll@merepost.com,@@Masuk123$$,0x564187ec61eedc399e44362e1930d40a9daec43e
francis.pacocha@rover.info,@@Masuk123$$,0x3ab52a0fdad97a2946e5d1d6c2b5675a1d220c38
libby.reichert@fexbox.org,@@Masuk123$$,0x7d73f52e357f178ea7e7fc478e399aa85c1424d7
carlo.stanton@merepost.com,@@Masuk123$$,0xa1a6f7e704fdd093868d92c8fc4305868c73a514
noel.goyette@merepost.com,@@Masuk123$$,0xa24c1db985db4ac33648f9fc388aeec56e13cf9f
jed.simonis@merepost.com,@@Masuk123$$,0x1385e49538706ffc883083b2038c99ed66294aea
royce.johnson@rover.info,@@Masuk123$$,0x287fa8b91c10f5702756c22af72bfa7dad5d8130
virginia.pouros@fexbox.org,@@Masuk123$$,0x976d12180e77e23d465faa170e790c16f48ee228
nella.auer@rover.info,@@Masuk123$$,0x5f7f2f3d9b48cd8f7032498b3efda228d9a5859f
shanelle.pfannerstill@fexbox.org,@@Masuk123$$,0xafa652fd08f4d3a5f3352d720f796930435a5def
arthur.oberbrunner@mailto.plus,@@Masuk123$$,0x23530dff215576e663e3fead88a2874dba8b8be1
kaley.spencer@fexbox.org,@@Masuk123$$,0xb3b9fcab75f7bfe76fc3fbd7669e68fa2ac71022
charlott.pacocha@merepost.com,@@Masuk123$$,0x3425fff4295a20cae447e3951d3e6311c28ae054
gerard.padberg@fexbox.org,@@Masuk123$$,0x8871a8d18c68aff0c121580ac38b1f2b61762639
emory.wiegand@merepost.com,@@Masuk123$$,0x06b99c746c08b2216ad92150ad898363e54518cd
jack.rutherford@rover.info,@@Masuk123$$,0x8ccb5c2f2b3fc5bb8629a72b823a3f35b7ec1acf
derek.tromp@mailto.plus,@@Masuk123$$,0x8435ba5ea7fcd0c79c68e14b8ad194e85048822d
cory.langosh@rover.info,@@Masuk123$$,0x10bfdc9ebefd06e6d5ff079b0988250dba323776
dong.will@fexbox.org,@@Masuk123$$,0xad9e895ec0e1beaebbf8e87bb5dfc26eb82569ca
frankie.goodwin@fexbox.org,@@Masuk123$$,0x6198597f4794127cc9c3928c4a76d60430534916
arlie.toy@mailto.plus,@@Masuk123$$,0x0932fc97c661a81eb6626fca3421d4c5453dfb74
ernie.collins@rover.info,@@Masuk123$$,0x465fb47872680be50e63cc9f7b7d297bb31b5b34
madlyn.haley@merepost.com,@@Masuk123$$,0x76826a190fb0272c608c7ba92d044f29acd7e550
margarete.nikolaus@mailto.plus,@@Masuk123$$,0x8cd9bc3a2fc32e4bfece1b9e3fffd094172ca45f
johnson.bergnaum@fexbox.org,@@Masuk123$$,0xc46c20955da7539e306ba7004299041ab8868bfa
lenny.bashirian@mailto.plus,@@Masuk123$$,0xf09b961b5a857cb03dce86e69a14236ff8a159ab
ernest.hudson@mailto.plus,@@Masuk123$$,0xc3e786cfc307a562fd2138a887f15318a70239f9
clark.little@merepost.com,@@Masuk123$$,0x12b601474e2ae1c5c0865ed2053021f90964a21e
cheyenne.krajcik@merepost.com,@@Masuk123$$,0xd54f0cfb65a5abb917768ac3573fb7fbcd3158b2
avis.schuster@rover.info,@@Masuk123$$,0x466219eca233887d6c2e4a3cea296ff7e576c3db
max.hagenes@mailto.plus,@@Masuk123$$,0x79a72d86b29a572193c4d93e0848248ed4964be9
jimmy.ullrich@mailto.plus,@@Masuk123$$,0x22a76ad9a48eec229b854a0d9a3bc4708a463200
antione.rice@rover.info,@@Masuk123$$,0xf832e2ca6753e46b610addd0a28c8ff1070590b3
florencio.heaney@rover.info,@@Masuk123$$,0xbc7b3ac7e2fb8492ebdd9d3a79541ba0dc778f09
jaime.mitchell@rover.info,@@Masuk123$$,0x77f17fdf36ce6518d912a430b2160bc90fd7db73
hedwig.smitham@rover.info,@@Masuk123$$,0x2c72519baf8ca121bdbccaeab51882dac8d29a7d
hannelore.stroman@fexbox.org,@@Masuk123$$,0xd7caaef7ecf7c9f5cb4ac7abb30a92b5d159dcd5
paris.grant@merepost.com,@@Masuk123$$,0x92a39be0d02dce8b4819f795c65ff23c3e2b5ef3
jaime.bednar@mailto.plus,@@Masuk123$$,0xc5aa815b2f27b2d569d58e72a46f3a4c2d8b74a5
alia.cremin@rover.info,@@Masuk123$$,0x3dccf01d4b835f7a0a1b2b15c684f5f03c770cf4
luke.wehner@fexbox.org,@@Masuk123$$,0x89a5db03d8e845b82e6470b562ff4d778e81b3ff
terrence.schumm@mailto.plus,@@Masuk123$$,0xc7d39af59ab9a13baf6c2047e1e31ed348fa9a0e
ernesto.hoppe@merepost.com,@@Masuk123$$,0xe79bf45a02c284b73792d741de8b3b5191d94a32
stephany.crona@mailto.plus,@@Masuk123$$,0xd2fbf87bab6e2e95194625b219907e9deb9a961d
dale.herzog@fexbox.org,@@Masuk123$$,0x014811e2ffdf5ecac3998e8d3acbf22e6105e480
douglass.keebler@merepost.com,@@Masuk123$$,0x8c63ed9747c565e5665c81cf9b62b75f183300db
bell.stark@fexbox.org,@@Masuk123$$,0x745f80765ad8c00fdcee8e2db9da0c54cdbc85eb
elva.prohaska@mailto.plus,@@Masuk123$$,0xbf2cf727cb550fe2a41bda13bb2a626ba3ffcdf8
michal.o'keefe@fexbox.org,@@Masuk123$$,0x84fd64eb3d0e80de8dac33753c1f2581b235d729
myrl.hermann@rover.info,@@Masuk123$$,0xa2380d85e247b6fa9ebc268db677e7168fa77a65
peg.lynch@merepost.com,@@Masuk123$$,0x25eb489572ae38b94c1c8a78b342193bb849a42d
eugenie.gerhold@rover.info,@@Masuk123$$,0xd6146aa494e71b9c3a74ef088eb9d758cbf6525c
rory.schamberger@rover.info,@@Masuk123$$,0x969cc3612974be1ffcd4f44531652f1f1a3e61e2
al.nolan@fexbox.org,@@Masuk123$$,0x7c24ea0f455dd994b1564b25ba1187b6f2d9d2ab
elijah.wolf@fexbox.org,@@Masuk123$$,0x08dd6fd04b1c2fa8882d820196860c9ecc03e956
versie.ernser@mailto.plus,@@Masuk123$$,0xf56770ab50705a52e763d8c74d5939d276903c38
fredrick.haley@rover.info,@@Masuk123$$,0x950a53a14edd9e3768ce1e6d485c1087a3a991e9
milton.ullrich@merepost.com,@@Masuk123$$,0x7646d440540dbde3986ce73bfdc5797fc03760e3
hortencia.welch@rover.info,@@Masuk123$$,0x0045837ea1b01d6e23c26bcc2b78885f614ce107
cleopatra.o'kon@merepost.com,@@Masuk123$$,0xf75919c1836a4881320bcd65b52ae735b41bff21
ray.hodkiewicz@fexbox.org,@@Masuk123$$,0x0ff65d4f9d816df1017978082d6b94caf5104967
hildred.kautzer@merepost.com,@@Masuk123$$,0x2d83bfcae26a9ab22df8bc32dd2b08f262d5037f
sonny.glover@mailto.plus,@@Masuk123$$,0x0ac50878017142573cef85c75a7a1643837c80e5
darrel.gleason@mailto.plus,@@Masuk123$$,0xde056851dc81b68b6f8d52981375b40da3d0fa3a
lincoln.wiza@fexbox.org,@@Masuk123$$,0x308a36e3725b8b9344f54c8f19d551d437deca24
hugh.bins@fexbox.org,@@Masuk123$$,0xe4fe4cf874e81b2a02081cb7eb57e70b350b4661
ronnie.johnston@fexbox.org,@@Masuk123$$,0xa7a11ef6d58a71bdb72c34846ff1f2c9deeba817
burt.monahan@merepost.com,@@Masuk123$$,0x4e95ac11d01e84d0f898db2a671db289d2b68b53
hwa.hudson@fexbox.org,@@Masuk123$$,0xc04a5adfd4acd94fe0199aa76daa84c884b57934
gerald.huel@merepost.com,@@Masuk123$$,0xebbc390d793e182f38fbf14799bfc6e1b70920c9
daryl.hackett@rover.info,@@Masuk123$$,0x4bb9116dc3a37be612cd1b9ad7c9cfeaea6aa8c6
tomas.shields@fexbox.org,@@Masuk123$$,0x612a1cacaee65524495661acce9824d8998b4283
rubye.wilderman@mailto.plus,@@Masuk123$$,0x3be33ad6fca1de8e58023a69120de8453d6e92e8
donnie.volkman@mailto.plus,@@Masuk123$$,0x7fc555d311bc555d3dbcfdd537e7fbc88d7dc265
genaro.murphy@fexbox.org,@@Masuk123$$,0x4d9ff22c98b9d66b3002d2ad13be612f7d34c852
tomas.kulas@rover.info,@@Masuk123$$,0x971c02845cd98482be7d64676ce0b4991119e630
jarvis.mertz@fexbox.org,@@Masuk123$$,0xa07211303149541273290b4dcd74a0c4aed9d816
casandra.schultz@fexbox.org,@@Masuk123$$,0x502a174d0933e0556ab539acc0a72581cd8181b4
sammie.oberbrunner@fexbox.org,@@Masuk123$$,0xc756a106bec96d2c199b214402e7b87d820af56f
jacinto.wilkinson@merepost.com,@@Masuk123$$,0xf5cede8ba20b2a03c7d8daab97a44337be11beed
tamatha.bernier@fexbox.org,@@Masuk123$$,0x05e801a1c8dc23ab0a6e031c5c49c18d22b6e58d
lajuana.schoen@fexbox.org,@@Masuk123$$,0x2aba24d3ff2f30e6ddb99b812a429bc3a3556c61
donn.gusikowski@rover.info,@@Masuk123$$,0x11e5541237db8453a90c61077f2d94ee2e2d806f
antoine.doyle@rover.info,@@Masuk123$$,0x63777da3e61dc9bd9ce4e3b1dd5ab20dd369e808
edith.nikolaus@merepost.com,@@Masuk123$$,0xe6fa3987c13613df0aada05b4d00d67754456999
celine.carter@rover.info,@@Masuk123$$,0xce0d50fc01c0c91f2ff2a72659ce596b3f09ec3b
ernest.witting@mailto.plus,@@Masuk123$$,0x3d2a49073ac8645f9147ac0f01171a6fc599a55d
rex.harris@rover.info,@@Masuk123$$,0x7748b85c9e1cfad1fad3351ed36d6333e8feed08
sydney.denesik@mailto.plus,@@Masuk123$$,0x227fe14021da45999471fa8d2c7d066ef81963d5
starr.klein@merepost.com,@@Masuk123$$,0x3a26164d66c2cb971d3f859fb4d301482e0aa11d
doloris.veum@merepost.com,@@Masuk123$$,0x815ed4a1b69de2bacc8ed66ed8d505f94498c321
wilber.keeling@merepost.com,@@Masuk123$$,0x2b0f1aa31845e3cf7131c5a5b067e713bff51001
maxine.abbott@merepost.com,@@Masuk123$$,0x6c68fdf9c0784be8cce4c2c63cf04e556ea78a20
kenny.zemlak@mailto.plus,@@Masuk123$$,0xa9c8baeb3461a1bbc867b747702dc196a1a98ee5
sterling.nienow@merepost.com,@@Masuk123$$,0x0d0a9ea82e29a7116b5d521d0ffcd17d80a76eeb
keith.schimmel@mailto.plus,@@Masuk123$$,0x249fd04071f9040ef6655058fd1d35cbb5cbf8af
aletha.hilpert@rover.info,@@Masuk123$$,0xf4098801ce7621dd606302e16e8cc6ba99262c13
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
