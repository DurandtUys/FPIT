
  import { FileInterceptor} from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { editFileName, imageFileFilter } from './utils/file-uploads.utils';

export default function handler(req,res)
{
      res.status(200).json();
}