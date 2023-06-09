const fs = require("fs");
const path = require("path");

const imageFolderIpfsCID = "QmanU4QcTro4VMzJKvD3UtnKdaVusnpfmy2NBW7NNvoDAL";
const getPureName = (content) => content.split(".")[0] ?? "";

const createMetadata = (imageFileName) => {
  const name = getPureName(imageFileName);
  const content = {
    description: "Blocto assignment second collection",
    name,
    image: `https://ipfs.io/ipfs/${imageFolderIpfsCID}/${imageFileName}`,
    attributes: [],
  };
  return JSON.stringify(content, null, "	");
};
let count = 0;
const createJsonFiles = (fileName) => {
  // const name = getPureName(fileName);
  const metadata = createMetadata(fileName);
  const metadataPath = path.join(__dirname, "metadata", "new", `${count}`);
  count++;
  fs.writeFileSync(metadataPath, metadata);
  return;
};

(async () => {
  // get file name
  const imagePath = path.join(__dirname, "images", "icon");
  fs.readdir(imagePath, (err, files) => {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.sort().forEach(createJsonFiles);
  });
})();