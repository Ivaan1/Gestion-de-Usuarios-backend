const uploadToPinata = async (fileBuffer, fileName) => {
    //const privateUrl = `https://uploads.pinata.cloud/v3/files`; 
    const publicURL = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    const blob = new Blob([fileBuffer])
    data.append('file', blob, fileName);
    // data.append('file', fileBuffer, fileName);
    const metadata = JSON.stringify({
        name: fileName
    });
    data.append('pinataMetadata', metadata);
    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', options);
    try {
        const response = await fetch(publicURL, {
            method: 'POST',
            body: data,
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
                'pinata_api_key': process.env.PINATA_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET
            }
        });
        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al subir el archivo a Pinata:', error);
        throw error;
    }
};

module.exports = {uploadToPinata}