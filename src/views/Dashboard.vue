<template>
    <div class="dashboard">

        <div class="content">
            
            <PageHeader title="Dashboard" />

            <v-container v-if="loading">
                <v-row justify="center">
                    <v-col class="flex-grow-0">
                        <v-progress-circular indeterminate />
                    </v-col>
                </v-row>
            </v-container>

            <v-container v-else-if="projects.length == 0">
                <v-row justify="center" align="center" style="height: 400px">
                    <v-btn to="/projects/create" text>Create</v-btn> or be invited to a project in order to visualize progress here!
                </v-row>
            </v-container>

            <div v-else>
                <v-container>
                    <v-row justify="space-between">
                        <v-col cols="12" md="4">
                            <v-select v-model="selectedProj" :items="projItems" label="Select a Project"></v-select>
                        </v-col>

                        <v-col class="text-right">
                            <v-btn to="/projects" class="primary">Go to Projects</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>

                        <v-col>
                            
                            <v-card elevation="1" tile class="pa-3">
                                <v-card-title>Tickets By Type</v-card-title>
                                <PieChart class="ticket-chart" v-if="!loading" :chart-data="typedata" :options="options" />
                            </v-card>
                        </v-col>
                        <v-col>
                            
                            <v-card elevation="1" tile class="pa-3">
                                <v-card-title>Tickets By Status</v-card-title>
                                <PieChart class="ticket-chart" v-if="!loading" :chart-data="statusdata" :options="options" />
                            </v-card>
                        </v-col>
                        <v-col>

                            <v-card elevation="1" tile class="pa-3">
                                <v-card-title>Tickets By Priority</v-card-title>
                                <PieChart class="ticket-chart" v-if="!loading" :chart-data="prioritydata" :options="options" />
                            </v-card>
                        </v-col>
                        <v-col>

                            <v-card elevation="1" tile class="pa-3">
                                <v-card-title>Tickets Resolved Over Time</v-card-title>
                                <LineChart class="ticket-chart" v-if="!loading" :chart-data="tickettimedata" :options="lineoptions" />
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card elevation="1" tile class="pa-3 text-center">
                    <v-card-title class="justify-center">More Charts Coming Soon!</v-card-title>
                </v-card>
            </div>
        </div>
        
    </div>
</template>

<script>
import ProjectService from '@/api/ProjectService';
import TicketService from '@/api/TicketService';
import PageHeader from '@/components/PageHeader';
import PieChart from '@/components/PieChart';
import LineChart from '@/components/LineChart';
import { mapState } from 'vuex';

export default {
    name: 'Dashboard',
    components: {
        PageHeader,
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
                responsive: true,
                maintainAspectRatio: false
            },
            lineoptions: {
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
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
        ...mapState('user', ['isLoggedIn']),
        projItems() {
            let projs = [
                {
                    value: -1,
                    text: 'All Projects'
                }
            ];
            projs.push(...this.projects.map(p => {
                return {
                    value: p.id,
                    text: p.title
                }
            }));
            return projs;
        }
    },
    methods: {
        updateCounts() {
            this.typecounts[0] = this.tickets.filter(ticket => ticket.type_id==1).length;
            this.typecounts[1] = this.tickets.filter(ticket => ticket.type_id==2).length;
            this.typecounts[2] = this.tickets.filter(ticket => ticket.type_id==3).length;
            this.typecounts[3] = this.tickets.filter(ticket => ticket.type_id==4).length;
            this.typedata.datasets[0].data = this.typecounts;

            this.statuscounts[0] = this.tickets.filter(ticket => ticket.status_id==1).length;
            this.statuscounts[1] = this.tickets.filter(ticket => ticket.status_id==2).length;
            this.statuscounts[2] = this.tickets.filter(ticket => ticket.status_id==3).length;
            this.statuscounts[3] = this.tickets.filter(ticket => ticket.status_id==4).length;
            this.statusdata.datasets[0].data = this.statuscounts;

            this.prioritycounts[0] = this.tickets.filter(ticket => ticket.priority_id==1).length;
            this.prioritycounts[1] = this.tickets.filter(ticket => ticket.priority_id==2).length;
            this.prioritycounts[2] = this.tickets.filter(ticket => ticket.priority_id==3).length;
            this.prioritycounts[3] = this.tickets.filter(ticket => ticket.priority_id==4).length;
            this.prioritydata.datasets[0].data = this.prioritycounts;

            for(let i = 0; i < 12; i++) {
                this.tickettimecounts[i] = this.tickets.filter(item => {
                    return item.resolvedAt && new Date(item.resolvedAt).getMonth() == this.last12[i].getMonth();
                }).length;
            }
            this.tickettimedata.datasets[0].data = this.tickettimecounts;
        },
        async getAllTickets() {
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
            if(val === -1) {
                await this.getAllTickets();
            } else {
                await this.getSelectedProject();
            }
        }
    },
    async mounted() {
        this.loading = true;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        for(let i = 0; i < 12; i++) {
            let now = new Date().getMonth();
            const time = new Date(new Date().setMonth(now - i));
            this.last12.unshift(time);
            let month = time.getMonth();
            let year = time.getFullYear();
            this.tickettimedata.labels[11 - i] = months[month] + ' ' + year;
        }
        ProjectService.getProjects().then(res => {
            this.projects = res;
        });
        await this.getAllTickets();
    }
};
</script>

<style scoped>

.ticket-chart {
    width: 300px;
    height: 300px;
}
</style>