const { followed } = require('../controllers/follow');
const Follow = require('../models/follow')

const followUsersIds = async (identityUserId) =>{
        //hacer una consulta de los usuarios que estamos siguiendo
        const following =  await Follow.find({user: identityUserId})
        .select("followed")
        .exec()

        //hacer una consulta de usuarios que me siguen
        const followers = await Follow.find({followed: identityUserId})
        .select("user")
        .exec();
         
        let followingClean = [];
        following.forEach((follow)=>{
            followingClean.push(follow.followed)
        })

        let followersClean = [];
        followers.forEach((follow)=>{
            followersClean.push(follow.user)
        })

        return { followingClean, followersClean }
}   

//este usuario me sigue o lo sigo, para que se puede mostrar por pantalla
const followThisUser = async (identityUserId, profileUserId) => {
      //hacer una consulta de los usuarios que estamos siguiendo
      const following =  await Follow.findOne({ user: identityUserId },{ followed: profileUserId })
      .select("followed")
      .exec()

      //hacer una consulta de usuarios que me siguen
      const followers = await Follow.findOne({followed: identityUserId },{ user: profileUserId })
      .select("user")
      .exec();

      return { following, followers}
}

module.exports = { followUsersIds, followThisUser };