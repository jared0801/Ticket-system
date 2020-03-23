import axios from 'axios';

const url = process.env.VUE_APP_API + '/projects';

class ProjectService {
    // Get all projects
    static getProjects() {
        return new Promise((resolve, reject) => {
            axios.get(url).then((res) => {
                const data = res.data;
                resolve(data.map(project => ({
                    ...project,
                    createdAt: new Date(project.createdAt)
                })));
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Get a single project
    static getProject(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/${id}`).then((res) => {
                const project = res.data;
                resolve({
                    ...project,
                    createdAt: new Date(project.createdAt)
                });
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Create a project
    static createProject(project) {
        return axios.post(url, {
            ...project
        });
    }

    // Create a project
    static updateProject(project) {
        return axios.post(`${url}/${project.id}`, {
            ...project
        });
    }

    // Delete tickets
    static deleteProject(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default ProjectService;