import { Statistics } from "constants/ui"
import "./statsBar.css"

function StatsBar() {
    return (
        <div className="stats-bar mx-3 mx-md-5 mb-5">
            <div className="container">
                <div className="row text-center g-4">

                    {Statistics.map((item, index) => (
                        <div className="col-6 col-md-3" key={index}>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    {<item.icon />}
                                </div>
                                <div className="num">{item.value}</div>
                                <div className="lbl">{item.label}</div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default StatsBar