# ucfeventtracker

This was a class project for COP 4710 Database Systems at UCF in Spring 2021

The main goal of the project was to make a server that interfaces with a database and provides a frontend gui to interact with it. 
Other requirements involved making ER diagrams and reports about how the project worked

### Problem:  
Most universities in the country hosts events around campus and off campus. These events are
organized by college students in most of the cases. Students are clustered (RSO’s or
Registered Student Organizations) by different organizations, clubs, fraternities around campus.
These events are of different types: social, fundraising, tech talks, etc. Now, each university has
a website where they post their events for the upcoming weeks. One needs to check the
website to add each event to his/her calendar. These events are just official events and not all
events around the university are included. Another limitation is that one has no way to track
weekly events.  
  
### Project Description  
You are asked to implement a web application that solves the problems. Any student may
register with this application to obtain a user ID and a password. There are three user levels:
super admin who creates a profile for a university (name, location, description, number of
students, pictures, etc.), admin who owns an RSO and may host events, and student who uses
the application to look up information about the various events.
Admin can create events with name, event category, description, time, date, location, contact
phone, and contact email address. A location should be set from a map (Bing, Google, open
street map) with name, latitude, longitude, etc. To populate the database, one can use feeds
(e.g., RSS, XML) from events.ucf.edu. Each admin is affiliated with one university, and one or
more RSOs. A student user can request to create a new RSO or to join an existent one. A new
RSO can be created with at least 5 other students with the same email domain, e.g.,
@knights.ucf.edu; and one of them should be assigned as an administrator.
Student can view events in their university by location, or by selecting the University they want
to see the events from. They can retrieve events according to their level of access or scope. A
student should be able to see all the events around its location or from RSOs they are following.
There are differenttypes of events(social, fundraising, tech talks, etc.). Each event can be public,
private, or an RSO event. Public events can be seen by everyone; private events can be seen by
the students at the host university; and an RSO events can only be seen by members of the RSO.
In addition, events can be created without an RSO. Such events must be approved by the super
admin. After an event has been published, users can add, remove, and edit comments on the
event, as well as rating the event with up to 5 stars. The application should offer some social
network integration, e.g., posting from the application to Facebook or Google
