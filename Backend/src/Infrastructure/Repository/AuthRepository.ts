import { AuthMapper } from "../../Application/mapper/AuthMapper"
import EAuth from "../../Domain/Entity/auth";
import { IUserRepository } from "../../Domain/Interface/Repositories/UserRepository";
import { authModel } from "../database/model/authmodel";


export class AuthRepository implements IUserRepository{
  async findById(id: string): Promise<EAuth | null> {
    const authUser = await authModel.findById(id);
    if(authUser){
      return AuthMapper.toEntityFromDocument(authUser)
    }
    return null
  }

  async findByEmail(email: string): Promise<EAuth | null> {
      const authUser = await authModel.findOne({email});
      if(authUser){
        return AuthMapper.toEntityFromDocument(authUser)
      }
      return null
  }

  async create(user: EAuth): Promise<EAuth> {
      const authUser = await authModel.create({
        displayname:user.displayname,
        email:user.email,
        passwordHash:user.passwordHash,
        googleId:user.googleId!,
        role:user.role,
        isBlocked:user.isBlocked,
        isNewUser:user.isNewUser,
      })
      return AuthMapper.toEntityFromDocument(authUser)
  }
  async update(user: EAuth): Promise<EAuth | null> {
    if (!user.id) {
      return null;
    }
  
    const updatedUser = await authModel.findByIdAndUpdate(
      user.id,
      {
        displayname: user.displayname,
        passwordHash: user.passwordHash,
        isBlocked: user.isBlocked,
        isNewUser: user.isNewUser,
        updatedAt: user.updatedAt,
      },
      { new: true } // return updated document
    );
  
    if (!updatedUser) {
      return null;
    }
  
    return AuthMapper.toEntityFromDocument(updatedUser);
  }
  
}
  
