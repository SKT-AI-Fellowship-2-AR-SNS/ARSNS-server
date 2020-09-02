module.exports = 
    (rawProfileData) => {
        profileData = {
            "name": rawProfileData.name,
            "image": rawProfileData.image,
            "message": rawProfileData.message
        };
        return profileData;
    };