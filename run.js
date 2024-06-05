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
sackgalbinovw181+l4ghe@outlook.com,@@Masuk123$$,0x889a60bf94bf5d20549c519a40abbb5d13cd4a33
joegriffin3246+cr5a8@outlook.com,@@Masuk123$$,0x1eb0defb8cef20973a6aff3da7b67794831ae59b
nicholasmontgomery4547+qhwct@outlook.com,@@Masuk123$$,0xa01134353ba70cf6466502d1fe45be54be318b72
juliadelgado5858+pcxah@outlook.com,@@Masuk123$$,0x7f5292815eadee279c847d050176d2d2aac148c9
zacheryeverly132+su4rz@outlook.com,@@Masuk123$$,0x3483260a5b7982f79187f59c93ac7bf8b9f7e881
owenhiser417+rfxfs@outlook.com,@@Masuk123$$,0x76844f004b0618f92ac5938939f16228780f16de
kellyroberts4546+wsdt6@outlook.com,@@Masuk123$$,0x27cd097a0d205a96e20cecd432e6b4ed2c411681
larryhanson4347+uh9ss@outlook.com,@@Masuk123$$,0xe364a1b40037d2b58e4660453817e5e8acdebf10
benjaminrice5775+yybfp@outlook.com,@@Masuk123$$,0x9beb0d539a1204221d72b146c4eb06520051c0dc
malvinakinzer951+sznva@outlook.com,@@Masuk123$$,0x7b55322ff396017e54a4e4c43bddba7f5913890d
musawakilia.bub.aka.r@googlemail.com,@@Masuk123$$,0x2a99f225175c88c0911037a6c04904a70d00fe97
janelleseales675+vk1un@outlook.com,@@Masuk123$$,0x99e4d860996a65c13a56d9c26b14a447ee20936a
dorothyortega56421+jlggr@outlook.com,@@Masuk123$$,0x5beedf6910a46877def6ae27901fb3e060b2e4a0
kathleenwallace4369+afd7e@outlook.com,@@Masuk123$$,0x4e6682b0bc068edabd49994f7f6180a26ecc2896
miguel214281+wbrgq@outlook.com,@@Masuk123$$,0xaefbeb9beb75addfa220e84496c51a0d85c977db
vtowne8992+molci@outlook.com,@@Masuk123$$,0x498eda25e5b07a16c2b1626b99447fc56c554544
edwardferguson5546+tqrpo@outlook.com,@@Masuk123$$,0xf379df964d7749d0288ef6073e81bd21c7bd863e
zacherydoll5432+pkyhz@outlook.com,@@Masuk123$$,0xec52c0f19a375cfb633ee2346ba393881c7dae62
lisaowens3234+ds39s@outlook.com,@@Masuk123$$,0x338c134c58185e04236903d9bb281313d257c439
anthonydunn7689+buek3@outlook.com,@@Masuk123$$,0x3ef721c3ba9104c8ebd810a2387efa46d7563f8b
crespodonnetta235+0xmas@outlook.com,@@Masuk123$$,0xdb1402c71c0f75aa8f91a8d8cf41297955faa0ae
barbaragonzalez1112+7blfr@outlook.com,@@Masuk123$$,0xd45422c1e95fe4e6e01d86b6eaa6bab6c8f0ec54
donetta.larkin@rover.info,@@Masuk123$$,0xbc493b154b021793ad8f23b7e2053b571066fe94
buster.bruen@rover.info,@@Masuk123$$,0x2233ef12aec8dbba355caa8188a5590882bce09d
abraham.jakubowski@rover.info,@@Masuk123$$,0x13eb102c2476201c556170fa849fd877f303e01c
billie.murray@merepost.com,@@Masuk123$$,0x1cc1a6fa8090076e1a78c5e355c803119ccfb3f8
dawn.watsica@fexbox.org,@@Masuk123$$,0xaaa9ace559f9a025d1e8751877ed9ea1b1c94368
mariano.feeney@mailto.plus,@@Masuk123$$,0x67dfd1db673dc184cf53c391d51c745b5f8acb99
carlblakely248+ntnwo@outlook.com,@@Masuk123$$,0x316ccae3a985467a2bbbde3d9e7c7f3f86ee4f92
jennifercoward309+8aear@outlook.com,@@Masuk123$$,0x8d0b6de45988ab780f1f0dfdb0074da4bc864f9a
corrieroyse771+qhahq@outlook.com,@@Masuk123$$,0x5e90fff24f501476b0b88e4a104795f80bff0d2f
elviajamerson650+eggyl@outlook.com,@@Masuk123$$,0xdda9aed686c362a91eb1a9c3dc9e7a54fac87baf
sarahboyd3467+q4bwv@outlook.com,@@Masuk123$$,0xabec7eace8c5bf75d7fdd7c582beb803a4b45d3c
amandatucker3578+si72z@outlook.com,@@Masuk123$$,0x031e7a2940f92faa37c26c08e662836b3e94ae87
lupelocklear6473+makvs@outlook.com,@@Masuk123$$,0x6088326d185cdc162d5f1966844db6142ea7ede8
amandakeller3257+flhiy@outlook.com,@@Masuk123$$,0x9e14f3276807c99aeaff115177c36d2a679b427a
melisacriner171+aivso@outlook.com,@@Masuk123$$,0x4ec3d67cf95393913273942d3cd388dc5edf38bf
broderhbuckridgemr932+kdpcq@outlook.com,@@Masuk123$$,0x9442717c7ff775e28305d948b6beaa528b5879dd
jennifercoward309+mbdhq@outlook.com,@@Masuk123$$,0x787337e44ab7278199c7a7f2fa43734c409ffb29
lorenzodepuy606+coeef@outlook.com,@@Masuk123$$,0x875c798f3d84f1da35d7c422c7f08baecc76a779
prestoncosme736+aoudb@outlook.com,@@Masuk123$$,0x4a988e1948d9ae82b5e23aaa2567e1bc78b37ab4
jerriedumont671+wmymg@outlook.com,@@Masuk123$$,0xe420f74a241942eb0fc16691e68f65b0eea59278
stevenwood53468+vvvz7@outlook.com,@@Masuk123$$,0x09f2fa51f78e59c951d09b91efec9fd53f5ef1d4
zacheryeverly132+9c7gu@outlook.com,@@Masuk123$$,0x6c11720dcea73f03f5be3a78b4425239fefd2096
aaroncarr4576+pz9hh@outlook.com,@@Masuk123$$,0x6c3e976e11737fa70bb33209db6379201e72fff9
maryleedacosta228+bah10@outlook.com,@@Masuk123$$,0xe2d6023f40ab4b01f8c3d1a8e51e6b645983249c
merrynoyola940+dbbjg@outlook.com,@@Masuk123$$,0x9fff3ed19abd77a9e13eb35697931e67bed0d2d8
daphne.thiel@fexbox.org,@@Masuk123$$,0xe9f3407b58a3fa0a5910e444accb6b98ed9c5055
chu.davis@mailto.plus,@@Masuk123$$,0x8edfcd9a14367109b2cf2bc9722d0e6a12c267a7
eloise.stanton@rover.info,@@Masuk123$$,0x9c151a2abb1bdf937b27d60d226186b691496c9b
jenifer.monahan@mailto.plus,@@Masuk123$$,0xc7a6facd67680f2bfe7cf03f6fc6bd5e8a7fb54c
howard.rodriguez@mailto.plus,@@Masuk123$$,0xd4b4f44fbcc3386c17bd9a1da387f892beb21bfe
david.glover@fexbox.org,@@Masuk123$$,0x596586b7dc8fe417cea3f2bed1948b40e17a3d16
duane.witting@merepost.com,@@Masuk123$$,0x2e468b67cfdf71a4834c090b6f96b8ff4cfd3873
ellis.rolfson@fexbox.org,@@Masuk123$$,0xfa6ace379335232ef58a6b95a40dfe23828ae556
bradley.turner@mailto.plus,@@Masuk123$$,0xa0f1210cc01fbcfbec548a2125a551d338e8fc0d
olin.wuckert@fexbox.org,@@Masuk123$$,0xd271b3ca0057215acc39952c9504ecaa54eb4385
louis.olson@mailto.plus,@@Masuk123$$,0x2445e6a8db22aaf2e1a2ee123c26589e292ae319
gena.stracke@merepost.com,@@Masuk123$$,0x6e5d463f9c5c27a5505e4309473776fceb2662bc
erwin.stokes@fexbox.org,@@Masuk123$$,0xf1b5e7e2578228b38f196bc0a8f403e43aa24f7b
jerrell.kunze@rover.info,@@Masuk123$$,0xe87051c0a856c85b296c1d9da887811997e91dc5
reginald.aufderhar@merepost.com,@@Masuk123$$,0x980ce7b198066ccb70e9fec3927e2124112534af
dannie.turcotte@mailto.plus,@@Masuk123$$,0x49a22e3580521f33141a6c148607a3c5ea117e48
maybell.hintz@mailto.plus,@@Masuk123$$,0x956303614d530c900c8800f4c64dea5d62e0f530
alton.corkery@fexbox.org,@@Masuk123$$,0x190788348df321a6debcf50104723ebad72a7dbf
natashia.balistreri@fexbox.org,@@Masuk123$$,0x67546aabef2bd3ec026dce571143f39a1a96dd48
mireille.morar@merepost.com,@@Masuk123$$,0x40f1a3d0d85e4946437327d87ab5eae95d322228
vance.miller@mailto.plus,@@Masuk123$$,0x5903477b11e2b7c6f695814fbc2daf60c171aac8
herma.rodriguez@merepost.com,@@Masuk123$$,0x3af27cc7fb424b3ae0ec5c9de84615cbce99edae
taquekoslowom.b.b.a4985@googlemail.com,@@Masuk123,0x3e1034567814cb2a096b771411f45df356a23d93
sandieoyervidesqz.vyy36.6.5@googlemail.com,@@Masuk123,0xf757898f9363583becebd3e056654a5aed1be1cf
wishamdepatx.h.sg.9419@googlemail.com,@@Masuk123,0xabc095a3e0de74cd95f1bbc821556e746ac6ab5a
zennerlakowskiaqb.i.c.2.0.36@googlemail.com,@@Masuk123,0x42171571d4ffce6088e57dd41914f950a1bf60e9
ajc.om.panyp.l@googlemail.com,@@Masuk123,0x7a45d2e71209002a49f7088dc302b194fefc7d32
caraelebymij.ef.3.94.4@googlemail.com,@@Masuk123,0xd5b9b59db345fd81e58a0d302bb2e82321184a0d
margaretcamms.1.6.1.987@googlemail.com,@@Masuk123,0x36a3dfb14200e1e394d18de415ba2c7ceac1a986
takakohunderlachl.f.sz.94.0@googlemail.com,@@Masuk123,0x3bf92ea0e84e66596d7b51794a5083d6e99a9c1a
bazalduamosseriv.qsl.f63.0.3@googlemail.com,@@Masuk123,0xf12f1812227765eae938b663451f49b8c673a013
prospernadelsz.mn.x11.82@googlemail.com,@@Masuk123,0xb31bf167390ed3121a233aaebd6a99553f792615
barbar.cartwright@mailto.plus,@@Masuk123$$,0x8ea62aca38fc418b18a7386accd8f3c209b1d996
chiquita.king@merepost.com,@@Masuk123$$,0xc462831496795a74ab069ae6c4763c7f1f7cc1f7
sandy.buckridge@rover.info,@@Masuk123$$,0xc99fb87e9ae6bc7666eb7a9cb5a02e6981166c6b
joshua.mosciski@fexbox.org,@@Masuk123$$,0x1c1855158ac634d2bbf4694f44bb70952443f403
sid.terry@mailto.plus,@@Masuk123$$,0x66b048303d87e64e34053a3d6fe40e193ce1b0d3
sam.schamberger@mailto.plus,@@Masuk123$$,0x612a49ada461f527191113319aea2a1f715c2083
sherell.grady@fexbox.org,@@Masuk123$$,0x080f2fe7bf5b0e434f101001ad74d7ca707a4775
octavio.ortiz@fexbox.org,@@Masuk123$$,0xa4335c93b71522a6d670dbe89866715da24200ee
brandon.rosenbaum@mailto.plus,@@Masuk123$$,0x06879d5315c8d95fcc43c0465215ebf03b424031
ferdinand.grimes@merepost.com,@@Masuk123$$,0x51d2d7479ea0819bdc3b84ef97248900f053a923
jonathan.reichert@rover.info,@@Masuk123$$,0xca58a96bdbd3ae592c158f6b6b012b01e7c96a01
lurline.emmerich@fexbox.org,@@Masuk123$$,0x0f99639659209d3236163ff1e6b3893182517a09
zachary.zboncak@fexbox.org,@@Masuk123$$,0xb320d2418ceb00b71c9b8df887cdaed03aadfcbf
wilton.kuhlman@rover.info,@@Masuk123$$,0xe222bc9c9d7171558a161b2407ca4ccc57c63244
dorthea.volkman@fexbox.org,@@Masuk123$$,0x941d9d7b4e3bc523c49b3661efac2f9c4e78ca23
sharice.hand@merepost.com,@@Masuk123$$,0xe775529d8bc576c72549dc24a25387ebc7f6ea0e
nichole.witting@fexbox.org,@@Masuk123$$,0xf71ac03434f74410941c0517e948377c9852050a
christoper.kub@merepost.com,@@Masuk123$$,0x7c6f129545c79f0d2d9e94c0e4a73fe820634a22
bethanie.maggio@mailto.plus,@@Masuk123$$,0x5b50b53e063badf949fb115e51522003b2a0668b
zachary.price@fexbox.org,@@Masuk123$$,0xba5a35617010160f575e0f73f2a929b0345fa98e
ahmad.fritsch@rover.info,@@Masuk123$$,0x459b2f3c748bb663aab4aba033421ec69564d864
jonah.quitzon@merepost.com,@@Masuk123$$,0x3ea41e9169656796bdc6e66426614a632ed25f5b
roxanne.turcotte@rover.info,@@Masuk123$$,0x903b7b7228667a703242fcc1a2ee4f168645647d
molly.johnson@rover.info,@@Masuk123$$,0xfb00e473e4e3bf43b26259cc2025e972a60eb6b3
zachariah.kassulke@fexbox.org,@@Masuk123$$,0x9595681f8316ccea9a251abd91d96213f48157d6
monty.barrows@rover.info,@@Masuk123$$,0x6e6fc99dd15c9c647aa2aa5a7fa2db81210fe2f8
lacy.walker@mailto.plus,@@Masuk123$$,0x03c900a774edfbc10d72209a28e92b246a35e43b
todd.hermiston@merepost.com,@@Masuk123$$,0x5970e460758b036b5e1c607c7e48ae5842ad6e74
carol.lynch@mailto.plus,@@Masuk123$$,0x069b998f367266a04fa318539bdf922799d01c92
kimi.collins@merepost.com,@@Masuk123$$,0xd4a070f38a011600a49cc310d3d0e946010bfd84
avis.bruen@merepost.com,@@Masuk123$$,0x747ac2641b05abb73714888171d3fa06c9a6e864
robbie.hintz@merepost.com,@@Masuk123$$,0x0b215af2cf42e6390f94879196029fcbaf104aaf
mariella.romaguera@fexbox.org,@@Masuk123$$,0xc7c6c1aeb3a52a44243833c8e22b80ca7bd65882
buster.wisozk@mailto.plus,@@Masuk123$$,0x2d1f77722a8ef81147a1ddc70ddbea1da0db4e4c
neoma.schneider@rover.info,@@Masuk123$$,0xb794c0506712ea9f5e4658138b249f37837be9ca
maynard.vandervort@merepost.com,@@Masuk123$$,0xe1cf9bcfbe5efcc2f129a37a2cbe46472f67bc98
vilma.koepp@mailto.plus,@@Masuk123$$,0x15113c043d07824b4f75e09d64d35ffa54fb0e0c
claudio.dooley@merepost.com,@@Masuk123$$,0x4e6ae048428cac78fc54830f2d52853f1d9b3fec
laverna.huels@merepost.com,@@Masuk123$$,0x60a957b54de8e328e572e8ac099b22647178afee
sueann.johnson@merepost.com,@@Masuk123$$,0xcd6b4b332703d6c33dea67168330a0ddf140add9
lakendra.morar@fexbox.org,@@Masuk123$$,0xa5a7d29719d9be6f13579fe379c1f363b51c5c09
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
