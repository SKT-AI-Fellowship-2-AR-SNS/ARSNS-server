module.exports = 
    (rawProfileData) => {
        profileData = {
            "name": rawProfileData.name,
            "profileImage": rawProfileData.profileImage,
            "message": rawProfileData.message,
            "id": rawProfileData.id
        };
        return profileData;
    };