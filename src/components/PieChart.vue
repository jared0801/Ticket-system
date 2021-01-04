
<script>
import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins;

export default {
    extends: Pie,
    mixins: [reactiveProp],
    props: ['options'],
    data () {
        return {}
    },
    mounted () {
        // chartData prop comes from the reactiveProp mixin of vue-chartjs
        this.renderChart(this.chartData, this.options)
    }
}
</script>

<style scoped>
</style>