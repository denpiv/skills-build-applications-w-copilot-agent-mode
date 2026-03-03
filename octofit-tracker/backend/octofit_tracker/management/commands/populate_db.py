from django.core.management.base import BaseCommand
from djongo import models
from django.conf import settings
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        client = MongoClient(host='localhost', port=27017)
        db = client['octofit_db']

        # Collections
        users = db['users']
        teams = db['teams']
        activities = db['activities']
        leaderboard = db['leaderboard']
        workouts = db['workouts']

        # Clear existing data
        users.delete_many({})
        teams.delete_many({})
        activities.delete_many({})
        leaderboard.delete_many({})
        workouts.delete_many({})

        # Create unique index on email
        users.create_index('email', unique=True)

        # Sample teams
        marvel_team = {'name': 'Marvel', 'members': []}
        dc_team = {'name': 'DC', 'members': []}
        marvel_team_id = teams.insert_one(marvel_team).inserted_id
        dc_team_id = teams.insert_one(dc_team).inserted_id

        # Sample users (superheroes)
        marvel_heroes = [
            {'name': 'Iron Man', 'email': 'ironman@marvel.com', 'team_id': marvel_team_id},
            {'name': 'Captain America', 'email': 'cap@marvel.com', 'team_id': marvel_team_id},
            {'name': 'Black Widow', 'email': 'widow@marvel.com', 'team_id': marvel_team_id},
        ]
        dc_heroes = [
            {'name': 'Superman', 'email': 'superman@dc.com', 'team_id': dc_team_id},
            {'name': 'Batman', 'email': 'batman@dc.com', 'team_id': dc_team_id},
            {'name': 'Wonder Woman', 'email': 'wonderwoman@dc.com', 'team_id': dc_team_id},
        ]
        user_ids = []
        for hero in marvel_heroes + dc_heroes:
            user_id = users.insert_one(hero).inserted_id
            user_ids.append(user_id)

        # Update teams with members
        teams.update_one({'_id': marvel_team_id}, {'$set': {'members': user_ids[:3]}})
        teams.update_one({'_id': dc_team_id}, {'$set': {'members': user_ids[3:]}})

        # Sample activities
        activities.insert_many([
            {'user_id': user_ids[0], 'type': 'run', 'distance': 5, 'duration': 30},
            {'user_id': user_ids[1], 'type': 'cycle', 'distance': 20, 'duration': 60},
            {'user_id': user_ids[2], 'type': 'swim', 'distance': 2, 'duration': 45},
            {'user_id': user_ids[3], 'type': 'run', 'distance': 10, 'duration': 50},
            {'user_id': user_ids[4], 'type': 'cycle', 'distance': 15, 'duration': 40},
            {'user_id': user_ids[5], 'type': 'swim', 'distance': 3, 'duration': 55},
        ])

        # Sample leaderboard
        leaderboard.insert_many([
            {'team_id': marvel_team_id, 'points': 150},
            {'team_id': dc_team_id, 'points': 120},
        ])

        # Sample workouts
        workouts.insert_many([
            {'user_id': user_ids[0], 'workout': 'Pushups', 'reps': 50},
            {'user_id': user_ids[1], 'workout': 'Squats', 'reps': 40},
            {'user_id': user_ids[2], 'workout': 'Plank', 'duration': 120},
            {'user_id': user_ids[3], 'workout': 'Pushups', 'reps': 60},
            {'user_id': user_ids[4], 'workout': 'Squats', 'reps': 45},
            {'user_id': user_ids[5], 'workout': 'Plank', 'duration': 150},
        ])

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
