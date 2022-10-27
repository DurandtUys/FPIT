import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
      bodyParser: false
    }
  };

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    await saveFile(files.file);
    res.status(201).json(files.file);
  });
};

const saveFile = async (file) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./files/test.png`, data);
  return;
};
