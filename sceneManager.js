class SceneManager {
    constructor() {
        this.inBattle = false;
    }

    registerMapManager(mapManager) {
        this.mapManager = mapManager;
    }
    registerBattleManager(battleManager) {
        this.battleManager = battleManager
    }

    draw() {
        if (this.inBattle) {
            this.battleManager.draw();
        }
        else {
            this.mapManager.draw();
        }
    }
}

const sceneManager = new SceneManager();