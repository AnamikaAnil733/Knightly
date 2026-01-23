import { BaseRepository } from "./BaseRepository";
import { PuzzleModel } from "../database/model/puzzleModel";
import { EPuzzle } from "../../Domain/Entity/puzzle";
import { PuzzleSchemaType } from "../database/Schema/puzzleSchema";
import { IPuzzleRepository } from "../../Domain/Interface/Repositories/IPuzzleRepository";
import { PuzzleMapper } from "../../Application/mapper/PuzzleMapper";
import { PuzzleType } from "Domain/Types/PuzzleTypes";


export class PuzzleManagementRepository extends BaseRepository<EPuzzle,PuzzleSchemaType>
implements IPuzzleRepository{
    constructor(){
        super(PuzzleModel,PuzzleMapper)
    }

    async findAll(filter?: { difficulty?: PuzzleType; }): Promise<EPuzzle[]> {
        const query: Partial<PuzzleSchemaType> & { isActive: boolean } = {
            isActive: true,
          };
          if (filter?.difficulty) {
            query.difficulty = filter.difficulty;
          }
          const docs = await this.model.find(query).sort("-createdAt");


          return docs.map((doc) =>
            PuzzleMapper.toEntityFromDocument(doc),
          );
    }

    async softDelete(id: string): Promise<boolean> {
        const puzzle = await this.findById(id);
      
        if (!puzzle) {
          return false;
        }
      
        puzzle.deactivate();    
        await this.update(puzzle);  
      
        return true;
      }
      




}