import UserRepo from '../src/interface/user';

export default async ()=>{
    const data = {
        full_name:"super admin",
        username:"admin",
        email: "admin@royal.com",
        role:'manager',
        password: UserRepo.hashPassword('12'),
        status:"Active"
    }
    const {isPresent} = await UserRepo.checkIfItExists({username:data.username});
    if(isPresent) return;
    await UserRepo.insert(data);
}
