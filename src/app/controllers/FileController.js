import * as Yup from 'yup';
import File from '../models/File';

class FileController {
  async store(req, res) {
    const schema = Yup.object().shape({
      filename: Yup.string().required(),
      originalname: Yup.string().required(),
    });

    if (!(await schema.isValid(req.file))) {
      return res.status(401).json({ error: 'Validation Fails' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
