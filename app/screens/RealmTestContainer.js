import React from 'react';
import {View, Text} from 'react-native';
import {floDB, Address, Patient, Visit, Episode, LatLong, CreateAndSaveDummies} from '../utils/data/schema';


const getAllPatients = () => {
    console.log('==========================================');
    const patients = floDB.objects(Patient.schema.name);
    //console.log('Patients:', patients);
    console.log('NO OF PATIENTS:', patients.length);
    console.log('==========================================');
};

const getAllAddresses = () => {
    console.log('==========================================');
    const addresses = floDB.objects(Address.schema.name);
    //console.log('Addresses:', addresses);
    console.log('NO OF Addresses:', addresses.length);
    console.log('==========================================');
};

const getAllVisits = () => {
    console.log('==========================================');
    const visits = floDB.objects(Visit.schema.name);
    //console.log('Visits:', visits);
    console.log('NO OF VISITS:', visits.length);
    console.log('==========================================');
};

const getAllEpisodes = () => {
    console.log('==========================================');
    const episodes = floDB.objects(Episode.schema.name);
    //console.log('Episodes:', episode);
    console.log('NO OF EPISODES:', episodes.length);
    console.log('==========================================');
};

const getEpisodeForVisit = () => {
    console.log('==========================================');
    const visits = floDB.objects(Visit.schema.name);
    const visit = visits[0];
    const episode = visit.episode[0];
    console.log('The corresponding episode to the first visit is:', episode);
    const patient = episode.patient;
    console.log('The corresponding patient to the first visit is:', patient);
    console.log('==========================================');
};

const getPatientForEpisode = () => {
    console.log('==========================================');
    const episodes = floDB.objects(Episode.schema.name);
    const episode = episodes[0];
    const patient = episode.patient;
    console.log('The corresponding patient to the first episode is:', patient);
    console.log('==========================================');
};

const getLatLongForPatient = () => {
    const patients = floDB.objects(Patient.schema.name);
    const patient = patients[0];
    const latLong = patient.address.latLong;
    console.log('==========================================');
    console.log('The corresponding latLong to the first patient is:', latLong);
    console.log('==========================================');
};

const getAllLatLongs = () => {
    console.log('==========================================');
    const latLongs = floDB.objects(LatLong.schema.name);
    console.log('All lat longs are:', latLongs);
    console.log('==========================================');
};


const RealmTestContainer = () => {
    //CreateAndSaveDummies();

    getAllPatients();
    getAllAddresses();
    getAllVisits();
    getAllEpisodes();
    getAllLatLongs();

    getEpisodeForVisit();
    getPatientForEpisode();
    getLatLongForPatient();

    return (
        <View>
            <Text>Hello world</Text>
        </View>
    );
};

export default RealmTestContainer;
