import axios from 'axios';

const url = process.env.VUE_APP_API + '/projects';

class ProjectService {
    // Get all projects
    static getProjects() {
        return new Promise((resolve, reject) => {
            axios.get(url).then((res) => {
                const projects = res.data;
                resolve(projects);
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
                resolve(project);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Create a project
    static createProject(project) {
        return axios.post(url, project);
    }

    // Update a project
    static updateProject(project) {
        return axios.post(`${url}/${project.id}`, project);
    }

    // Delete a project
    static deleteProject(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default ProjectService;