const {create} = require('@web3-storage/w3up-client');

let client, space;

async function initStorachaClient() {
    if (client && space) {
        return {client, space};
    }

    client = await create();
    const account = await client.login(process.env.STORACHA_EMAIL);
    const spaceDID = process.env.PEERFUNDS_SPACE_DID;

    if (!spaceDID) {
        throw new Error('Missing space DID in environment');
    }

    // const SPACE_NAME = 'PeerFunds';
    space = await client.getSpace(spaceDID);
    if (!space) throw new Error('Failed to get space. DID may be invalid.')
    // if (!space) {
    //     space = await client.createSpace(SPACE_NAME, {account});
    // }

    await client.setCurrentSpace(space);

    return {client, space};
}

module.exports = {initStorachaClient};