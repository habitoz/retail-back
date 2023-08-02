import UserRepo from '../src/interface/user';

export default async ()=>{
    const data = {
        full_name:"super admin",
        email: "admin@admin.com",
        role:'manager',
        password: UserRepo.hashPassword('12'),
        status:"Active"
    }
    const {isPresent} = await UserRepo.checkIfItExists({email:data.email});
    if(isPresent) return;
    await UserRepo.insert(data);
}