import {PayClient, ViteClient} from "../Onoffchain.js";
import {EventEmitter} from "events";


class StatsHandler {
    statsEvents = new EventEmitter()
    isSubscribed = false
    stats = {
        height: 0,
        namesRegistered: 0,
        transactionsMade: 0,
    }
    getStats() {
        return this.stats
    }
    async updateStats() {
        const names = await PayClient.getRegisteredNamesCount()
        const transactions = await PayClient.getInvoiceCount();
        this.stats.namesRegistered = names
        this.stats.transactionsMade = transactions
    }
    async subscribeToBlocks() {
        if (this.isSubscribed) {
            return
        }
        this.isSubscribed = true
        await this.updateStats()
        ViteClient.subscribe("snapshotBlock")
            .then(subscription => {
                subscription.events.on("data", block => {
                    this.stats.height = block.height
                    this.statsEvents.emit("statsUpdate", this.stats)
                    if (block.height % 10) {
                        this.updateStats()
                    }
                })
            })
    }
}
export default new StatsHandler()
