import { BigInt } from "@graphprotocol/graph-ts"
import {
  RestakingFarm,
  AddNewPool,
  AdminChanged,
  BeaconUpgraded,
  ClaimReward,
  Deposit,
  EmergencyWithdraw,
  OwnershipTransferred,
  Paused,
  Unpaused,
  UpdatePoolMultiplier,
  UpdatePoolReward,
  Upgraded,
  Withdraw
} from "../generated/RestakingFarm/RestakingFarm"
import { ExampleEntity } from "../generated/schema"

export function handleAddNewPool(event: AddNewPool): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.lpToken = event.params.lpToken

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.capMintToken(...)
  // - contract.getMultiplier(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.paused(...)
  // - contract.pendingReward(...)
  // - contract.poolInfo(...)
  // - contract.poolLength(...)
  // - contract.poolTokenList(...)
  // - contract.purseToken(...)
  // - contract.totalMintToken(...)
  // - contract.userInfo(...)
}

export function handleAdminChanged(event: AdminChanged): void {}

export function handleBeaconUpgraded(event: BeaconUpgraded): void {}

export function handleClaimReward(event: ClaimReward): void {}

export function handleDeposit(event: Deposit): void {}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleUpdatePoolMultiplier(event: UpdatePoolMultiplier): void {}

export function handleUpdatePoolReward(event: UpdatePoolReward): void {}

export function handleUpgraded(event: Upgraded): void {}

export function handleWithdraw(event: Withdraw): void {}
