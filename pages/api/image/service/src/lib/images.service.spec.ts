import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/shared/src/lib/prismaService.service';
import { ImagesRepository } from '../../../repository/src/lib/images.repository';
import { ImagesService } from './images.service';


class image{
  id: number;
  userId:number;
  imageUrl:string;
  createdAt: Date;
  updatedAt: Date;

}
const MockApiImpl : jest.Mocked<image> = new image() as image;
describe('ApiAuthorizationRepositoryTest', () => {
    let data: ImagesService; //= new AuthenicationRepository(new PrismaService());
    //const prisma = new PrismaService();
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
          controllers: [],
          providers: [ImagesService,ImagesRepository,PrismaService],
        }).compile();
  
        data = moduleRef.get<ImagesService>(ImagesService);
      
    });
    it('should store image location', async () => {
      jest
        .spyOn(data, 'uploadfile')
        .mockImplementation(
          (): Promise<image | null> => Promise.resolve(MockApiImpl)
        );
  
      expect(
        await data.uploadfile(1,'awfdhowuiefhaw9pufh.png')
      ).toBe(MockApiImpl);
    });
});
