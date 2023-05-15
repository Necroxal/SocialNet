const mongoose =  require ('mongoose');

const connection = async(url) =>{
    try {
        await mongoose.connect(url);
        console.log('successful connection [DB]');
    } catch (error) {
        console.log(error)
        throw new Error('Could not connect to the database');
    }
}

module.exports = connection;


