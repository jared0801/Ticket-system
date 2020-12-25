import ProjectService from '../../api/ProjectService';


export default {
    namespaced: true,
    state: {
        tickets: [],
        projects: [],
        comments: []
    },
    getters: {
        getData(state) {
            return { 
                tickets: state.tickets,
                projects: state.projects,
                comments: state.comments,
             };
        }
    },
    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        }
    },
    actions: {
        getAppData(context) {
            ProjectService.getProjects().then(res => {
                context.commit('setProjects', res);
            }).catch(e => {
                console.log(e);
            });
        }
    }
}