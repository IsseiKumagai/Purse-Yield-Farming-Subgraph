import {
  BigInt,
  BigDecimal,
  store,
  Address,
  log,
} from "@graphprotocol/graph-ts";

import {
  AddNewPool,
  ClaimReward,
  Deposit,
  EmergencyWithdraw,
  UpdatePoolMultiplier,
  UpdatePoolReward,
  Withdraw,
  RestakingFarm,
} from "../generated/RestakingFarmSubgraph/RestakingFarm"; //These are all events + contract from the smart contracts

import {
  UserActions,
  UserDeposit,
  UserWithdraw,
  UserAddNewPool,
  UserUpdatePoolReward,
  UserUpdatePoolMultiplier,
  UserClaimReward,
  UserEmergencyWithdraw,
} from "../generated/schema";

// make this work with the below functions

// event Deposit(address indexed user, uint256 amount);
// event Withdraw(address indexed user, uint256 amount);
// event AddNewPool(address indexed owner, IERC20Upgradeable indexed lpToken, uint256 pursePerBlock, uint256 bonusMultiplier, uint256 startBlock);
// event UpdatePoolReward(address indexed owner, IERC20Upgradeable indexed lpToken, uint256 pursePerBlock);
// event UpdatePoolMultiplier(address indexed owner, IERC20Upgradeable indexed lpToken, uint256 bonusMultiplier);
// event ClaimReward(address indexed user, uint256 amount);
// event EmergencyWithdraw(address indexed user, IERC20Upgradeable indexed lpToken, uint256 amount);

function createUserActions(address: Address): UserActions {
  let entityUserActions = new UserActions(address.toHexString());
  entityUserActions.userDeposits = [];
  entityUserActions.userWithdraws = [];
  entityUserActions.userAddNewPools = [];
  entityUserActions.userUpdatePoolRewards = [];
  entityUserActions.userUpdatePoolMultipliers = [];
  entityUserActions.userClaimRewards = [];
  entityUserActions.userEmergencyWithdraws = [];
  entityUserActions.save();
  return entityUserActions as UserActions;
}

export function handleAddNewPool(event: AddNewPool): void {
  // load UserActions entity
  let entityUserActions = UserActions.load(
    event.transaction.from.toHexString()
  );

  // if UserActions entiry for this transaction caller does not exist, create new.
  if (entityUserActions === null) {
    entityUserActions = createUserActions(event.transaction.from);
  }

  // create new entity for the one in question
  let userAddNewPools = entityUserActions.userAddNewPools;
  let entityUserAddNewPool = new UserAddNewPool(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(userAddNewPools.length).toString())
  );

  // who called the function ?
  entityUserAddNewPool.sender = event.params.owner; // straight from the event
  entityUserAddNewPool.from = event.transaction.from;

  // straight from the events
  entityUserAddNewPool.lpTokenPoolAddress = event.params.lpToken;
  entityUserAddNewPool.amountTokenPerBlock = event.params.pursePerBlock;
  entityUserAddNewPool.numberBonusMultiplier = event.params.bonusMultiplier;
  entityUserAddNewPool.numberStartBlock = event.params.startBlock;

  // For historical data retreival we need timestamp and block number
  entityUserAddNewPool.timestamp = event.block.timestamp;
  entityUserAddNewPool.blockNumber = event.block.number;

  entityUserActions.userAddNewPools = userAddNewPools.concat([
    entityUserAddNewPool.id,
  ]);
  // userAddNewPools?.push(entityUserAddNewPool.id);
  // entityUserActions.userAddNewPools = userAddNewPools;
  entityUserAddNewPool.save();
  entityUserActions.save();
}

export function handleDeposit(event: Deposit): void {
  // load UserActions entity
  let entityUserActions = UserActions.load(
    event.transaction.from.toHexString()
  );

  // if UserActions entiry for this transaction caller does not exist, create new.
  if (entityUserActions === null) {
    entityUserActions = createUserActions(event.transaction.from);
  }

  // create new entity for the one in question
  let userDeposits = entityUserActions.userDeposits;
  let entityUserDeposit = new UserDeposit(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(userDeposits.length).toString())
  );

  // let restakingFarmContract = RestakingFarm.bind(event.address); // need to access the contract for local variable
  // entityUserDeposit.lpTokenPoolAddress = restakingFarmContract.

  // who called the function ?
  entityUserDeposit.sender = event.params.user; // straight from the event
  entityUserDeposit.from = event.transaction.from;

  // straight from the events
  entityUserDeposit.amountDeposit = event.params.amount;

  // For historical data retreival we need timestamp and block number
  entityUserDeposit.timestamp = event.block.timestamp;
  entityUserDeposit.blockNumber = event.block.number;

  entityUserActions.userDeposits = userDeposits.concat([entityUserDeposit.id]);
  // userDeposits?.push(entityUserDeposit.id);
  // entityUserActions.userDeposits = userDeposits;
  entityUserDeposit.save();
  entityUserActions.save();
}

export function handleClaimReward(event: ClaimReward): void {
  // load UserActions entity
  let entityUserActions = UserActions.load(
    event.transaction.from.toHexString()
  );

  // if UserActions entiry for this transaction caller does not exist, create new.
  if (entityUserActions === null) {
    entityUserActions = createUserActions(event.transaction.from);
  }

  // create new entity for the one in question
  let userClaimRewards = entityUserActions.userClaimRewards;
  let entityUserClaimReward = new UserClaimReward(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(userClaimRewards.length).toString())
  );

  // who called the function ?
  entityUserClaimReward.sender = event.params.user; // straight from the event
  entityUserClaimReward.from = event.transaction.from;

  // straight from the events
  entityUserClaimReward.pendingAmount = event.params.amount;

  // For historical data retreival we need timestamp and block number
  entityUserClaimReward.timestamp = event.block.timestamp;
  entityUserClaimReward.blockNumber = event.block.number;

  entityUserActions.userClaimRewards = userClaimRewards.concat([
    entityUserClaimReward.id,
  ]);
  // userClaimRewards?.push(entityUserClaimReward.id);
  // entityUserActions.userClaimRewards = userClaimRewards;
  entityUserClaimReward.save();
  entityUserActions.save();
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  // load UserActions entity
  let entityUserActions = UserActions.load(
    event.transaction.from.toHexString()
  );

  // if UserActions entiry for this transaction caller does not exist, create new.
  if (entityUserActions === null) {
    entityUserActions = createUserActions(event.transaction.from);
  }

  // create new entity for the one in question
  let userEmergencyWithdraws = entityUserActions.userEmergencyWithdraws;
  let entityUserEmergencyWithdraw = new UserEmergencyWithdraw(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(userEmergencyWithdraws.length).toString())
  );

  // who called the function ?
  entityUserEmergencyWithdraw.sender = event.params.user; // straight from the event
  entityUserEmergencyWithdraw.from = event.transaction.from;

  // straight from the events
  entityUserEmergencyWithdraw.lpTokenPoolAddress = event.params.lpToken;
  entityUserEmergencyWithdraw.totalAmountWithdraw = event.params.amount;

  // For historical data retreival we need timestamp and block number
  entityUserEmergencyWithdraw.timestamp = event.block.timestamp;
  entityUserEmergencyWithdraw.blockNumber = event.block.number;

  entityUserActions.userEmergencyWithdraws = userEmergencyWithdraws.concat([
    entityUserEmergencyWithdraw.id,
  ]);
  // userEmergencyWithdraws?.push(entityUserEmergencyWithdraw.id);
  // entityUserActions.userEmergencyWithdraws = userEmergencyWithdraws;
  entityUserEmergencyWithdraw.save();
  entityUserActions.save();
}

export function handleUpdatePoolMultiplier(event: UpdatePoolMultiplier): void {
  // load UserActions entity
  let entityUserActions = UserActions.load(
    event.transaction.from.toHexString()
  );

  // if UserActions entiry for this transaction caller does not exist, create new.
  if (entityUserActions === null) {
    entityUserActions = createUserActions(event.transaction.from);
  }

  // create new entity for the one in question
  let userUpdatePoolMultipliers = entityUserActions.userUpdatePoolMultipliers;
  let entityUserUpdatePoolMultiplier = new UserUpdatePoolMultiplier(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(userUpdatePoolMultipliers.length).toString())
  );

  // who called the function ?
  entityUserUpdatePoolMultiplier.sender = event.params.owner; // straight from the event
  entityUserUpdatePoolMultiplier.from = event.transaction.from;

  // straight from the events
  entityUserUpdatePoolMultiplier.lpTokenPoolAddress = event.params.lpToken;
  entityUserUpdatePoolMultiplier.numberBonusMultiplier =
    event.params.bonusMultiplier;

  // For historical data retreival we need timestamp and block number
  entityUserUpdatePoolMultiplier.timestamp = event.block.timestamp;
  entityUserUpdatePoolMultiplier.blockNumber = event.block.number;

  entityUserActions.userUpdatePoolMultipliers = userUpdatePoolMultipliers.concat(
    [entityUserUpdatePoolMultiplier.id]
  );
  // userUpdatePoolMultipliers?.push(entityUserUpdatePoolMultiplier.id);
  // entityUserActions.userUpdatePoolMultipliers = userUpdatePoolMultipliers;
  entityUserUpdatePoolMultiplier.save();
  entityUserActions.save();
}

export function handleUpdatePoolReward(event: UpdatePoolReward): void {
  // load UserActions entity
  let entityUserActions = UserActions.load(
    event.transaction.from.toHexString()
  );

  // if UserActions entiry for this transaction caller does not exist, create new.
  if (entityUserActions === null) {
    entityUserActions = createUserActions(event.transaction.from);
  }

  // create new entity for the one in question
  let userUpdatePoolRewards = entityUserActions.userUpdatePoolRewards;
  let entityUserUpdatePoolReward = new UserUpdatePoolReward(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(userUpdatePoolRewards.length).toString())
  );

  // who called the function ?
  entityUserUpdatePoolReward.sender = event.params.owner; // straight from the event
  entityUserUpdatePoolReward.from = event.transaction.from;

  // straight from the events
  entityUserUpdatePoolReward.lpTokenPoolAddress = event.params.lpToken;
  entityUserUpdatePoolReward.amountTokenPerBlock = event.params.pursePerBlock;

  // For historical data retreival we need timestamp and block number
  entityUserUpdatePoolReward.timestamp = event.block.timestamp;
  entityUserUpdatePoolReward.blockNumber = event.block.number;

  entityUserActions.userUpdatePoolRewards = userUpdatePoolRewards.concat([
    entityUserUpdatePoolReward.id,
  ]);
  // userUpdatePoolRewards?.push(entityUserUpdatePoolReward.id);
  // entityUserActions.userUpdatePoolRewards = userUpdatePoolRewards;
  entityUserUpdatePoolReward.save();
  entityUserActions.save();
}

export function handleWithdraw(event: Withdraw): void {
  // load UserActions entity
  let entityUserActions = UserActions.load(
    event.transaction.from.toHexString()
  );

  // if UserActions entiry for this transaction caller does not exist, create new.
  if (entityUserActions === null) {
    entityUserActions = createUserActions(event.transaction.from);
  }

  // create new entity for the one in question
  let userWithdraws = entityUserActions.userWithdraws;
  let entityUserWithdraw = new UserWithdraw(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(userWithdraws.length).toString())
  );

  // who called the function ?
  entityUserWithdraw.sender = event.params.user; // straight from the event
  entityUserWithdraw.from = event.transaction.from;

  // straight from the events
  entityUserWithdraw.amountWithdraw = event.params.amount;

  // For historical data retreival we need timestamp and block number
  entityUserWithdraw.timestamp = event.block.timestamp;
  entityUserWithdraw.blockNumber = event.block.number;

  entityUserActions.userWithdraws = userWithdraws.concat([
    entityUserWithdraw.id,
  ]);
  // userWithdraws?.push(entityUserWithdraw.id);
  // entityUserActions.userWithdraws = userWithdraws;
  entityUserWithdraw.save();
  entityUserActions.save();
}

/// Issei Kumagai
