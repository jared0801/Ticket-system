const RulesMixin = {
    data() {
        return {
            titleRules: [
                t => !!t || "A title is required.",
                t => (t.length > 2 && t.length < 255) || "Title must be between 3 and 254 characters long."
            ],
            descRules: [
                d => !!d || "A description is required."
            ],
            datePattern: /^(\d){4}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])/g,
            deadlineRules: [
                d => {
                    if(!d) return true;
                    const m = d.match(this.datePattern);
                    if(m !== null) {
                        this.dueAt = m[0];
                        return true;
                    }
                    return "Date must be in YYYY-MM-DD format."
                }
            ],
            typeRules: [
                d => !!d || "A type is required."
            ],
            priorityRules: [
                d => !!d || "A priority is required."
            ],
            usernameRules: [
                u => !!u || "Username is required.",
                u => (u.length > 3 && u.length < 33) || "Username must be between 4 and 32 characters long."
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
                p => !!p || "Password is required.",
                p => (p.length > 5 && p.length < 33) || "Password must be between 6 and 32 characters long."
            ],
            confPasswordRules: [
                p => !!p || "Password confirmation is required.",
                p => p === this.password || "Password confirmation must match your password."
            ]
        }
    }
}

export default RulesMixin;