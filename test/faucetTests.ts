import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';

const provider = waffle.provider

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner, otherSigner] = await ethers.getSigners();

    console.log('Signer 1 address: ', owner.address);

    return { faucet, owner, otherSigner };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdraws of more than .1 ETH at a time', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);
    const withdrawAmount = ethers.utils.parseUnits("1", "ether");
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('should not allow another signer to withdrawAll', async function () {
    const { faucet, otherSigner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(otherSigner).withdrawAll()).to.be.revertedWithoutReason;
  });

  it('should not allow another signer to destroyFaucet', async function () {
    const { faucet, otherSigner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(otherSigner).destroyFaucet()).to.be.revertedWithoutReason;
  });

  it('should allow owner to withdrawAll', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
   faucet.connect(owner).withdrawAll()
  });

  it('should allow owner to destroyFaucet', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    faucet.connect(owner).destroyFaucet()
  });

});