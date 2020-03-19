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

    // Create a project
    static createProject(project) {
        return axios.post(url, {
            ...project
        });
    }

    // Delete tickets
    static deleteProject(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default ProjectService;