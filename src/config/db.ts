import mongoose, {ConnectOptions} from "mongoose"
import colors from "colors"

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI as string)

        console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline.bold);
        return connect
    } catch (error: any) {
        console.log(`Error: ${error.message}`.red.bold);
        process.exit()
    }
}

export default connectDB