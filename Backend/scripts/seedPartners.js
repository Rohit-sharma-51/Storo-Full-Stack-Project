const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        seedAllPartners();
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Partner Schema
const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    capacity: { type: Number, required: true },
    base: { type: Number, default: 100 },
    perKg: { type: Number, default: 10 },
    perHour: { type: Number, default: 5 },
    isApproved: { type: Boolean, default: true } // Auto-approve seeded partners
}, { timestamps: true });

partnerSchema.index({ location: '2dsphere' });

const Partner = mongoose.model('Partner', partnerSchema);

// All partners data consolidated from seedPartners, seedMorePartners, and seedNCRPartners
async function seedAllPartners() {
    const allPartners = [
        // ========== DELHI PARTNERS ==========
        {
            name: 'Sheraton Grand Delhi',
            address: 'District Centre, Saket, New Delhi, Delhi 110017',
            location: { type: 'Point', coordinates: [77.2167, 28.5244] },
            capacity: 50,
            base: 150,
            perKg: 15,
            perHour: 8
        },
        {
            name: 'Lemon Tree Premier Delhi Airport',
            address: 'Asset Area 10, Hospitality District, Aerocity, New Delhi 110037',
            location: { type: 'Point', coordinates: [77.1025, 28.5562] },
            capacity: 35,
            base: 100,
            perKg: 10,
            perHour: 5
        },
        {
            name: 'Taj Palace New Delhi',
            address: '2, Sardar Patel Marg, Diplomatic Enclave, New Delhi 110021',
            location: { type: 'Point', coordinates: [77.1892, 28.5978] },
            capacity: 80,
            base: 250,
            perKg: 25,
            perHour: 15
        },
        {
            name: 'The Imperial New Delhi',
            address: 'Janpath, Connaught Place, New Delhi 110001',
            location: { type: 'Point', coordinates: [77.2167, 28.6289] },
            capacity: 60,
            base: 230,
            perKg: 23,
            perHour: 14
        },
        {
            name: 'Radisson Blu Plaza Delhi',
            address: 'National Highway 8, Mahipalpur, New Delhi 110037',
            location: { type: 'Point', coordinates: [77.1194, 28.5450] },
            capacity: 50,
            base: 130,
            perKg: 13,
            perHour: 7
        },

        // ========== MUMBAI PARTNERS ==========
        {
            name: 'Ibis Mumbai Airport',
            address: 'Western Express Highway, Andheri East, Mumbai, Maharashtra 400059',
            location: { type: 'Point', coordinates: [72.8681, 19.0896] },
            capacity: 40,
            base: 120,
            perKg: 12,
            perHour: 6
        },
        {
            name: 'The Oberoi Mumbai',
            address: 'Nariman Point, Mumbai, Maharashtra 400021',
            location: { type: 'Point', coordinates: [72.8234, 18.9250] },
            capacity: 70,
            base: 200,
            perKg: 20,
            perHour: 12
        },
        {
            name: 'Trident Bandra Kurla',
            address: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
            location: { type: 'Point', coordinates: [72.8697, 19.0653] },
            capacity: 45,
            base: 140,
            perKg: 14,
            perHour: 8
        },

        // ========== BANGALORE PARTNERS ==========
        {
            name: 'Marriott Bangalore Whitefield',
            address: 'EPIP Area, Whitefield, Bangalore, Karnataka 560066',
            location: { type: 'Point', coordinates: [77.7499, 12.9698] },
            capacity: 60,
            base: 180,
            perKg: 18,
            perHour: 10
        },
        {
            name: 'ITC Gardenia Bangalore',
            address: 'Residency Road, Bangalore, Karnataka 560025',
            location: { type: 'Point', coordinates: [77.6069, 12.9762] },
            capacity: 55,
            base: 160,
            perKg: 16,
            perHour: 9
        },
        {
            name: 'The Leela Palace Bangalore',
            address: 'Old Airport Road, Bangalore, Karnataka 560008',
            location: { type: 'Point', coordinates: [77.6648, 12.9579] },
            capacity: 65,
            base: 220,
            perKg: 22,
            perHour: 13
        },

        // ========== GOA PARTNERS ==========
        {
            name: 'Taj Exotica Goa',
            address: 'Calwaddo, Benaulim, Goa 403716',
            location: { type: 'Point', coordinates: [73.9364, 15.2632] },
            capacity: 50,
            base: 180,
            perKg: 18,
            perHour: 10
        },
        {
            name: 'Grand Hyatt Goa',
            address: 'Goa University Road, Bambolim, Goa 403206',
            location: { type: 'Point', coordinates: [73.8567, 15.4589] },
            capacity: 60,
            base: 170,
            perKg: 17,
            perHour: 10
        },

        // ========== CHENNAI PARTNERS ==========
        {
            name: 'ITC Grand Chola Chennai',
            address: 'Mount Road, Guindy, Chennai, Tamil Nadu 600032',
            location: { type: 'Point', coordinates: [80.2206, 13.0103] },
            capacity: 75,
            base: 190,
            perKg: 19,
            perHour: 11
        },
        {
            name: 'The Leela Palace Chennai',
            address: 'Adyar Seaface, MRC Nagar, Chennai, Tamil Nadu 600028',
            location: { type: 'Point', coordinates: [80.2574, 13.0067] },
            capacity: 55,
            base: 210,
            perKg: 21,
            perHour: 12
        },

        // ========== NOIDA PARTNERS ==========
        {
            name: 'Radisson Blu Noida',
            address: 'Plot No. C-1, Sector 55-56, Noida, Uttar Pradesh 201301',
            location: { type: 'Point', coordinates: [77.3595, 28.6050] },
            capacity: 45,
            base: 140,
            perKg: 14,
            perHour: 7
        },
        {
            name: 'Jaypee Greens Golf Resort Noida',
            address: 'Surajpur Kasna Road, Greater Noida, Uttar Pradesh 201306',
            location: { type: 'Point', coordinates: [77.4538, 28.4744] },
            capacity: 55,
            base: 160,
            perKg: 16,
            perHour: 9
        },

        // ========== GURUGRAM PARTNERS ==========
        {
            name: 'The Leela Ambience Gurugram',
            address: 'Ambience Island, NH-8, Gurugram, Haryana 122002',
            location: { type: 'Point', coordinates: [77.0688, 28.4595] },
            capacity: 70,
            base: 200,
            perKg: 20,
            perHour: 12
        },
        {
            name: 'Trident Gurugram',
            address: '443, Udyog Vihar, Phase V, Gurugram, Haryana 122016',
            location: { type: 'Point', coordinates: [77.0826, 28.4942] },
            capacity: 50,
            base: 150,
            perKg: 15,
            perHour: 8
        },

        // ========== CHANDIGARH PARTNERS ==========
        {
            name: 'JW Marriott Chandigarh',
            address: 'Plot No 6, Dakshin Marg, Sector 35-B, Chandigarh 160022',
            location: { type: 'Point', coordinates: [76.7794, 30.7333] },
            capacity: 60,
            base: 180,
            perKg: 18,
            perHour: 10
        },
        {
            name: 'Taj Chandigarh',
            address: 'Block No 9, Sector 17-A, Chandigarh 160017',
            location: { type: 'Point', coordinates: [76.7794, 30.7410] },
            capacity: 55,
            base: 170,
            perKg: 17,
            perHour: 10
        }
    ];

    try {
        console.log(`\n📋 Attempting to seed ${allPartners.length} partners...\n`);

        // Check if partners already exist
        const existingPartners = await Partner.find({
            name: { $in: allPartners.map(p => p.name) }
        });

        if (existingPartners.length > 0) {
            console.log(`⚠️  ${existingPartners.length} partner(s) already exist:`);
            existingPartners.forEach(p => console.log(`   - ${p.name}`));

            // Filter out existing partners
            const existingNames = existingPartners.map(p => p.name);
            const partnersToCreate = allPartners.filter(p => !existingNames.includes(p.name));

            if (partnersToCreate.length === 0) {
                console.log('\n✅ All partners already exist in database. No new partners to create.');

                // Show summary
                await showSummary();
                process.exit(0);
            }

            console.log(`\n🔄 Creating ${partnersToCreate.length} new partner(s)...\n`);
            const created = await Partner.insertMany(partnersToCreate);
            console.log('✅ Successfully created:');
            created.forEach(partner => {
                console.log(`   - ${partner.name}`);
            });
        } else {
            // Create all partners
            const createdPartners = await Partner.insertMany(allPartners);
            console.log(`✅ Successfully created ${createdPartners.length} partners!\n`);
        }

        // Show summary
        await showSummary();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding partners:', error.message);
        process.exit(1);
    }
}

// Show summary of partners by city
async function showSummary() {
    const allPartners = await Partner.find({});
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 TOTAL PARTNERS IN DATABASE: ${allPartners.length}`);
    console.log('='.repeat(50));

    const cities = {
        'Delhi': allPartners.filter(p => p.address.includes('Delhi') && !p.address.includes('Noida')).length,
        'Noida': allPartners.filter(p => p.address.includes('Noida')).length,
        'Gurugram': allPartners.filter(p => p.address.includes('Gurugram')).length,
        'Chandigarh': allPartners.filter(p => p.address.includes('Chandigarh')).length,
        'Mumbai': allPartners.filter(p => p.address.includes('Mumbai')).length,
        'Bangalore': allPartners.filter(p => p.address.includes('Bangalore')).length,
        'Goa': allPartners.filter(p => p.address.includes('Goa')).length,
        'Chennai': allPartners.filter(p => p.address.includes('Chennai')).length
    };

    console.log('\n📍 Partners by City:');
    Object.entries(cities).forEach(([city, count]) => {
        if (count > 0) {
            console.log(`   ${city.padEnd(15)} : ${count} partner${count !== 1 ? 's' : ''}`);
        }
    });
    console.log('');
}
