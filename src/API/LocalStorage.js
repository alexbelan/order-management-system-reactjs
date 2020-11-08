export const LocalStorage = {
    getOrder: function () {
        let data = JSON.parse(localStorage.getItem("order"))
        if (data !== null) {
            return data;
        } else {
            return [];
        }
    },
    getId: function () {
        let id = localStorage.getItem("id")
        if(id !== null) {
            return id
        } else {
            return 0
        }
    },
    getFirms: function () {
        let firms = JSON.parse(localStorage.getItem("firms"))
        if( firms !== null) {
            return firms
        } else {
            return {}
        }
    },
    saveOrder: function (data) {
        localStorage.setItem("order", JSON.stringify(data));
    },
    saveId: function (id) {
        localStorage.setItem("id", JSON.stringify(id));
    },
    saveFirms: function (firms) {
        localStorage.setItem("firms", JSON.stringify(firms));
    }
}