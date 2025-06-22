const {create} = require('@web3-storage/w3up-client');

let client, space;

async function initStorachaClient() {
    if (client && space) {
        return {client, space};
    }

    client = await create();
    const account = await client.login(process.env.STORACHA_EMAIL);
    await account.plan.wait();
    const spaceDID = process.env.PEERFUNDS_SPACE_DID;

    if (!spaceDID) {
        throw new Error('Missing space DID in environment');
    }

    await client.setCurrentSpace(`did:key:${spaceDID}`);

    // const SPACE_NAME = 'Peerfunds';
    space = client.currentSpace();
    if (!space) {
        throw new Error('Failed to get space. DID may be invalid.');
    }
    if (space.did() !== `did:key:${process.env.PEERFUNDS_SPACE_DID}`) {
        throw new Error('DID is wrong');
    }

    return {client, space};
}

module.exports = {initStorachaClient};