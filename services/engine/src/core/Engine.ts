
interface UserBalance {
  available: number;
  locked: number;
}

export class Engine {
  private balances: Map<String, UserBalance> = new Map()
  private orderbooks: [] = []

  constructor() {
    
  }
}