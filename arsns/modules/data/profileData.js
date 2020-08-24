module.exports = 
    (rawProfileData) => {
        profileData = {
            "name": rawProfileData.name,
            "image": rawProfileData.image
        };
        return profileData;
    };