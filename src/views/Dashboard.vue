<template>
    <div class="dashboard">

        <div class="content">
            
            <Header title="Dashboard" />

            <div class="field is-grouped">
                <div class="control right-align">
                    <router-link class="button" to="/projects">Go to Projects</router-link>
                </div>

                <div class="control select">
                    <select v-model="selectedProj">
                        <option value="-1">All projects</option>
                        <option :value="proj.id" v-for="proj in projects" :key="proj.id">{{proj.title}}</option>
                    </select>
                </div>
            </div>

            <div style="width: 100%;">
                <div class="graphGrid">
                    
                    <div class="chart-container">
                        Tickets By Type
                        <PieChart class="ticket-chart" v-if="!loading" :chart-data="typedata" :options="options" />
                    </div>

                    <div class="chart-container">
                        Tickets By Status
                        <PieChart class="ticket-chart" v-if="!loading" :chart-data="statusdata" :options="options" />
                    </div>

                    <div class="chart-container">
                        Tickets By Priority
                        <PieChart class="ticket-chart" v-if="!loading" :chart-data="prioritydata" :options="options" />
                    </div>

                    <div class="chart-container">
                        Tickets Resolved Over Time
                        <LineChart class="ticket-chart" v-if="!loading" :chart-data="tickettimedata" :options="lineoptions" />
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
//import UserService from '@/api/UserService';
import TicketService from '@/api/TicketService';
import Header from '@/components/Header';
import PieChart from '@/components/PieChart';
import LineChart from '@/components/LineChart';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
    name: 'Dashboard',
    components: {
        Header,
        PieChart,
        LineChart
    },
    data() {
        return {
            username: '',
            password: '',
            error: '',
            last12: [],
            loading: true,
            projects: [],
            tickets: [],
            typecounts: [],
            statuscounts: [],
            prioritycounts: [],
            tickettimecounts: [],
            selectedProj: -1,
            typedata: {
                labels: ['Bug / Error', 'Feature Request', 'Project Proposal', 'Training'],
                datasets: [{
                    label: '# of Tickets',
                    data: [],
                    borderAlign: 'inner',
                    borderWidth: 0,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)'
                    ]
                }]
            },
            statusdata: {
                labels: ['Open', 'In Progress', 'Blocked', 'Closed'],
                datasets: [{
                    label: '# of Tickets',
                    data: [],
                    borderAlign: 'inner',
                    borderWidth: 0,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)'
                    ]
                }]
            },
            prioritydata: {
                labels: ['Low', 'Medium', 'High', 'Urgent'],
                datasets: [{
                    label: '# of Tickets',
                    data: [],
                    borderAlign: 'inner',
                    borderWidth: 0,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)'
                    ]
                }]
            },
            tickettimedata: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [{
                    data: [],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }],
                fill: false
            },
            options: {
                legend: {
                    display: false
                },
                responsive: false,
                maintainAspectRatio: true,
                /*animation: {
                    onProgress: function(animation) {
                        console.log(this.value);
                        this.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                        if(this.value >= 1) this.value = 0;
                    }.bind(this)
                }*/
            },
            lineoptions: {
                legend: {
                    display: false
                },
                responsive: false,
                maintainAspectRatio: true,
                scales: {
					x: {
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					},
					y: {
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
                    },
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stepSize: 1
                        }
                    }],
				}
            }
        }
    },
    computed: {
        ...mapGetters('tickets', ['getData']),
        ...mapState('user', ['isLoggedIn'])
    },
    methods: {
        ...mapActions('tickets', ['getAppData']),
        updateCounts() {
            this.typecounts[0] = this.tickets.filter(ticket => ticket.type_id==1).length;
            this.typecounts[1] = this.tickets.filter(ticket => ticket.type_id==2).length;
            this.typecounts[2] = this.tickets.filter(ticket => ticket.type_id==3).length;
            this.typecounts[3] = this.tickets.filter(ticket => ticket.type_id==4).length;
            this.typedata.datasets[0].data = this.typecounts;

            this.statuscounts[0] = this.tickets.filter(ticket => ticket.status_id==0).length;
            this.statuscounts[1] = this.tickets.filter(ticket => ticket.status_id==1).length;
            this.statuscounts[2] = this.tickets.filter(ticket => ticket.status_id==2).length;
            this.statuscounts[3] = this.tickets.filter(ticket => ticket.status_id==3).length;
            this.statusdata.datasets[0].data = this.statuscounts;

            this.prioritycounts[0] = this.tickets.filter(ticket => ticket.priority_id==1).length;
            this.prioritycounts[1] = this.tickets.filter(ticket => ticket.priority_id==2).length;
            this.prioritycounts[2] = this.tickets.filter(ticket => ticket.priority_id==3).length;
            this.prioritycounts[3] = this.tickets.filter(ticket => ticket.priority_id==4).length;
            this.prioritydata.datasets[0].data = this.prioritycounts;

            for(let i = 0; i < 12; i++) {
                this.tickettimecounts[i] = this.tickets.filter(item => {
                    return item.resolvedAt && item.resolvedAt.getMonth() == this.last12[i].getMonth();
                }).length;
            }
            this.tickettimedata.datasets[0].data = this.tickettimecounts;
        },
        async getAllProjects() {
            this.loading = true;
            try {
                const tickets = await TicketService.getAllTickets();
                if(tickets) {
                    this.tickets = [];
                    this.tickets = tickets;
                }
                this.updateCounts();
                this.loading = false;
            } catch(err) {
                this.error = err.message;
                this.loading = false;
            }
        },
        async getSelectedProject() {
            this.loading = true;
            try {
                const tickets = await TicketService.getTickets(this.selectedProj);
                if(tickets) {
                    this.tickets = [];
                    for(const resolved of tickets.resolved) {
                        this.tickets.push(resolved);
                    }
                    for(const unresolved of tickets.unresolved) {
                        this.tickets.push(unresolved);
                    }
                }
                this.updateCounts();
                this.loading = false;
            } catch(err) {
                this.error = err.message;
                this.loading = false;
            }
        }
    },
    watch: {
        async selectedProj(val) {
            if(val === '-1') {
                await this.getAllProjects();
            } else {
                await this.getSelectedProject();
            }
        }
    },
    async mounted() {
        this.loading = true;
        const last12 = []
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        for(let i = 0; i < 12; i++) {
            let now = new Date().getMonth();
            const time = new Date(new Date().setMonth(now - i));
            this.last12.unshift(time);
            let month = time.getMonth();
            let year = time.getFullYear();
            this.tickettimedata.labels[11 - i] = months[month] + ' ' + year;
        }
        console.log(last12);
        await this.getAppData();
        this.projects = this.getData.projects;
        await this.getAllProjects();
    }
};
</script>

<style scoped>
.graphGrid {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
}

.chart-container {
    text-align: center;
}

.ticket-chart {
    margin: 5px;
}

@media screen and (max-width: 1500px){
    .graphGrid {
        grid-template-columns: 1fr 1fr;
    }
}

@media screen and (max-width: 900px){
    .graphGrid {
        grid-template-columns: 1fr;
    }
}
</style>