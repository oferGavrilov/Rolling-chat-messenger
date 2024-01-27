import cron from 'node-cron';
import { User } from '../models/user.model';
import logger from './logger.service';
class CleanupService {
    constructor() {
        // run every Saturday at 00:00
        cron.schedule('0 0 * * SAT', async () => {
            logger.info('Running weekly cleanup task');
            await this.cleanupExpiredResetTokens();
        });
    }
    async cleanupExpiredResetTokens() {
        try {
            const result = await User.updateMany({ resetPasswordExpires: { $exists: true } }, { $unset: { resetPasswordToken: "", resetPasswordExpires: "" } });
            logger.info(`Cleaned up ${result.modifiedCount} expired reset tokens.`);
        }
        catch (error) {
            logger.error('Error during weekly cleanup:', error);
        }
    }
}
export default CleanupService;
//# sourceMappingURL=cleanup.service.js.map