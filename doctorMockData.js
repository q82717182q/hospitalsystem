
const mockData = [
    {
        "name": "Clinic1",
        "address": "Address1",
        "doctor": "Doctor1",
        "email": "doctor1@example.com",
        "preference": "Preference1"
    },
    {
        "name": "Clinic2",
        "address": "Address2",
        "doctor": "Doctor2",
        "email": "doctor2@example.com",
        "preference": "Preference2"
    },
    {
        "name": "Clinic3",
        "address": "Address3",
        "doctor": "Doctor3",
        "email": "doctor3@example.com",
        "preference": "Preference3"
    },
    {
        "name": "Clinic4",
        "address": "Address4",
        "doctor": "Doctor4",
        "email": "doctor4@example.com",
        "preference": "Preference4"
    },
    {
        "name": "Clinic5",
        "address": "Address5",
        "doctor": "Doctor5",
        "email": "doctor5@example.com",
        "preference": "Preference5"
    },
    {
        "name": "Clinic6",
        "address": "Address6",
        "doctor": "Doctor6",
        "email": "doctor6@example.com",
        "preference": "Preference6"
    },
    {
        "name": "Clinic7",
        "address": "Address7",
        "doctor": "Doctor7",
        "email": "doctor7@example.com",
        "preference": "Preference7"
    },
    {
        "name": "Clinic8",
        "address": "Address8",
        "doctor": "Doctor8",
        "email": "doctor8@example.com",
        "preference": "Preference8"
    },
    {
        "name": "Clinic9",
        "address": "Address9",
        "doctor": "Doctor9",
        "email": "doctor9@example.com",
        "preference": "Preference9"
    },
    {
        "name": "Clinic10",
        "address": "Address10",
        "doctor": "Doctor10",
        "email": "doctor10@example.com",
        "preference": "Preference10"
    }
];

export const fetchDataFromAPI = async () => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return mockData;
    } catch (error) {
        throw new Error("Failed to fetch data");
    }
};