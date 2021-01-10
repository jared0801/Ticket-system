const DateMixin = {
    filters: {
        dateToHuman(t) {
            t = new Date(t);
            return `${t.getMonth()+1}/${t.getDate()}/${t.getFullYear()}`;
        }
    }
}

export default DateMixin;