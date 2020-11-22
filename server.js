const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const stream = require("stream");

const factory = require("./factory");

const PORT = 5000;
const app = express();
const upload = multer({ dest: "./uploads" });

const createBufferStream = (buff) => {
  const readStream = new stream.PassThrough();
  readStream.end(buff);

  return readStream;
};

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("./client"));

app.post("/keygen", (req, res) => {
  const keys = factory.keyGen();
  return res.json(keys);
});

app.post("/process", upload.single("cryptfile"), (req, res) => {
  if (!req.file) return res.status(500).send("Error uploading file");
  const { method, kpr, kpub } = req.body;
  try {
    if (method === "enc") {
      // Encrypt
      const result = factory.encrypt(req.file.path, kpr, kpub);
      const readStream = createBufferStream(result);
      res.set(
        "Content-disposition",
        "attachment; filename=" + req.file.originalname
      );
      res.set("Content-Type", "text/plain");
      readStream.pipe(res);
    } else if (method === "dec") {
      // Decrypt
      const result = factory.decrypt(req.file.path, kpr, kpub);
      const readStream = createBufferStream(result);
      res.set(
        "Content-disposition",
        "attachment; filename=" + req.file.originalname
      );
      res.set("Content-Type", "text/plain");
      readStream.pipe(res);
    } else {
      return res.status(401).send("Invalid method");
    }
  } catch (e) {
    return res.status(401).send('<h1 style="font-family:system-ui;padding:20px">Invalid Keys</h1>')
  }
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
