package com.example.person_management.service;

import com.example.person_management.entity.Person;
import com.example.person_management.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    // Add a new person or save changes
    public Person savePerson(Person person) {
        return personRepository.save(person);
    }

    // Get all persons
    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    // Get one person by ID
    public Optional<Person> getPersonById(Long id) {
        return personRepository.findById(id);
    }

    // Update a person
    public Optional<Person> updatePerson(Long id, Person updatedPerson) {
        return personRepository.findById(id)
                .map(existingPerson -> {
                    existingPerson.setName(updatedPerson.getName());
                    existingPerson.setAge(updatedPerson.getAge());
                    existingPerson.setGender(updatedPerson.getGender());
                    existingPerson.setPhoneNumber(updatedPerson.getPhoneNumber());

                    return personRepository.save(existingPerson);
                });
    }

    // Delete a person
    public boolean deletePerson(Long id) {
        if (personRepository.existsById(id)) {
            personRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
